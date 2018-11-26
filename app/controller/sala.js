function verificarPermicao(req, done) {
  //checar se o usuário está logado
  if (req.session.verificarSessao) {
    //destruir sessão
    if (typeof req.query.sair != "undefined" && req.query.sair == "sim") {
      req.session.destroy();
    }
    //checar se o usuário tem permição
    else {
      if (typeof req.session.autenticado == 'undefined')
        return done(Error('NAO-AUTENTICADO'));
      else
        return done(null);
    }
  } else
    return done(Error('NAO-LOGADO'));
}

var io;
module.exports.salaID = function(importIO, app) {
  var pool = app.config.dbConnection;
  var salaDAO = new app.app.model.salaDAO(pool);
  var io = importIO;
  var key = 'jogador';
  var key2 = 'capitao';

  io.on('connection', function(socket) {
    console.log('jogador entrou');
    var roomVar = io.sockets.adapter.rooms[socket.room];
    socket.id = socket.id;

    //ao jogador entrar na partida enviar o id
    socket.on('room', function(room) {
      socket.room = room;
      socket.join(room);
      roomVar = io.sockets.adapter.rooms[room];
      //checar número de jogadores dentro da partida
      var clients = roomVar.sockets;
      var numClients = Object.keys(clients).length;
      //atualizar a contagem de jogadores na partida
      io.to(room).emit('room users', numClients);
      //atualizar a contagem de jogadores no banco
      salaDAO.updateJogadoresByIdSala(room, numClients, function(error, results, fields) {
        if (error) {
          console.log(error);
          return
        } else
          console.log('sala atualizada ao um usuario entrar');
      });
    });

    //atualizar a contagem de jogadores na partida
    socket.on('room users', function(userlist) {
      io.emit('room users', userlist);
    });

    //atualizar lista de jogadores na partida
    socket.on('list users', function(picks, time1, time2) {
      io.emit('list users', picks, time1, time2);
      console.log('Atualizado lista de jogadores');
    });

    //receber dados do jogador
    socket.on('new user', function(btrid, nome, img, rank) {
      room = socket.room;
      socket.btrid = btrid;
      socket.img = img;
      socket.nome = nome;
      socket.rank = rank;

      var clients = roomVar.sockets;
      var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;

      //setar estado da sala
      roomVar.estado = 'espera';

      roomVar.picks = {};
      roomVar.picks[key] = [];

      roomVar.time1 = {};
      roomVar.time1[key] = [];
      roomVar.time1[key2] = [];

      roomVar.time2 = {};
      roomVar.time2[key] = [];
      roomVar.time2[key2] = [];

      for (var clientId in clients) {
        var clientSocket = io.sockets.connected[clientId];
        var data = {
          id: clientSocket.btrid,
          nome: clientSocket.nome,
          rank: clientSocket.rank,
          idimg: clientSocket.img,
          idsocket: clientSocket.id
        };
        roomVar.picks[key].push(data);
      }

      //gerar capitaes ao chegar 6 jogadores na sala
      if (roomVar.picks[key].length == 6) {
        //alterar estado da sala
        roomVar.estado = 'picks';

        salaDAO.updateStatusByIdSala(room, 2, function(error, results, fields) {
          if (error) {
            console.log(error);
            return
          } else
            console.log('status da sala atualizada para Picks');
        });

        //setar pick time
        roomVar.picktime = 0;

        capitao1 = [0, roomVar.picks[key][0].rank];
        capitao2 = [0, roomVar.picks[key][0].rank];

        for (var i = 1; i < roomVar.picks[key].length; i++) {
          if (roomVar.picks[key][i].rank < capitao1[1]) {
            capitao1[0] = i;
            capitao1[1] = roomVar.picks[key][i].rank;
          }
        }

        roomVar.time1[key2].push(roomVar.picks[key][capitao1[0]]);

        roomVar.picks[key].splice(capitao1[0], 1);

        for (var i = 1; i < roomVar.picks[key].length; i++) {
          if (roomVar.picks[key][i].rank < capitao2[1]) {
            if (roomVar.picks[key][i].rank != capitao1[1]) {
              capitao2[0] = i;
              capitao2[1] = roomVar.picks[key][i].rank;
            }
          }
        }

        roomVar.time2[key2].push(roomVar.picks[key][capitao2[0]]);

        roomVar.picks[key].splice(capitao2[0], 1);

        //dar permicao para pickar
        roomVar.idCapitao1 = roomVar.time1[key2][0].idsocket;
        roomVar.idCapitao2 = roomVar.time2[key2][0].idsocket;
        socketid = roomVar.idCapitao1
        console.log(socketid);
        io.to(socketid).emit('permicao pick');
        io.to(roomVar.idCapitao1).emit('turno', 1);
        io.to(roomVar.idCapitao2).emit('turno', 0);
        ///////////////////////////
      }

      io.to(room).emit('list users',
        roomVar.picks,
        roomVar.time1,
        roomVar.time2);
    });

    //permicao para fazer pick
    socket.on('permicao pick', function() {
      io.emit('permicao pick');
    });

    //fazer pick
    socket.on('pick', function(btrid) {
      console.log('PICK');

      if (roomVar.estado == 'picks') {

        for (var i = 0; i < roomVar.picks[key].length; i++) {
          if (roomVar.picks[key][i].id == btrid) {
            console.log(btrid);
            if (roomVar.picktime == 0) {
              console.log('foi pro 1 ' + roomVar.picks[key][i].id);
              roomVar.time1[key].push(roomVar.picks[key][i]);
            } else {
              console.log('foi pro 2 ' + roomVar.picks[key][i].id);
              roomVar.time2[key].push(roomVar.picks[key][i]);
            }

            roomVar.picks[key].splice(i, 1);

            io.to(room).emit('list users',
              roomVar.picks,
              roomVar.time1,
              roomVar.time2);

            //alterar estado da sala para em jogo
            if (roomVar.picks[key].length == 0) {
              console.log('PARTIDA COMEÇOU');

              io.to(roomVar.idCapitao1).emit('turno', 3);
              io.to(roomVar.idCapitao2).emit('turno', 3);
              io.to(roomVar.idCapitao1).emit('form resultado');
              io.to(roomVar.idCapitao2).emit('form resultado');

              roomVar.estado = 'jogando';

              //atualizar status da partida
              salaDAO.updateStatusByIdSala(room, 3, function(error, results, fields) {
                if (error) {
                  console.log(error);
                } else
                  console.log('status da sala atualizada para Em jogo');
              });

              //setar data de inicio da partida
              var date = new Date();
              roomVar.datainicio = date;
            }

            if (roomVar.picktime == 0) {
              roomVar.picktime = 1;
              io.to(roomVar.idCapitao2).emit('permicao pick');

              //atualizar alert de turno pra escolher
              io.to(roomVar.idCapitao2).emit('turno', 1);
              io.to(roomVar.idCapitao1).emit('turno', 0);
            } else {
              roomVar.picktime = 0;
              io.to(roomVar.idCapitao1).emit('permicao pick');

              //atualizar alert de turno pra escolher
              io.to(roomVar.idCapitao1).emit('turno', 1);
              io.to(roomVar.idCapitao2).emit('turno', 0);
            }
          }
        }
      }
    });

    //finalizar partida
    socket.on('report resultado', function(finalizado) {
      if (finalizado) {
        console.log('CONCLUIDO');
        roomVar.estado = 'finalizado';
      } else {
        console.log('CANCELADO');
        roomVar.estado = 'cancelado';
        io.to(room).emit('resultado', 0);

        salaDAO.updateStatusByIdSala(room, 5, function(error, results, fields) {
          if (error) {
            console.log(error);
            return
          } else
            console.log('status da sala atualizada para cancelado');
        });
      }
    });

    //ao jogador desconectar da partida
    socket.on('disconnect', function() {
      room = socket.room;

      //checar número de jogadores dentro da partida
      if (roomVar === undefined) {
        numClients = 0;

        //buscar status da sala
        salaDAO.selectStatusByIdSala(room, function(error, results, fields) {
          if (error) {
            console.log(error);
            return
          } else {
            status = results[0].ID_STATUS;

            //checar se a sala está em estado finalizado ou cancelado antes de deletar
            if (status < 4) {
              //deletar sala no banco se n tiver jogadores
              salaDAO.deleteSalaById(room, function(error, results, fields) {
                if (error) {
                  console.log(error);
                  return
                } else
                  console.log('sala deletada ao um usuario sair');
              });
            }

          }
        });
      } else {
        //detetar jogador da tabela picks
        for (var i = 1; i < roomVar.picks['jogador'].length; i++) {
          if (roomVar.picks['jogador'][i].id == socket.btrid) {
            roomVar.picks['jogador'].splice(i, 1);
          }
        }

        //atualizar tela
        io.to(room).emit('list users',
          roomVar.picks,
          roomVar.time1,
          roomVar.time2);

        clients = roomVar.sockets;
        numClients = Object.keys(clients).length;
        //atualizar a contagem de jogadores no banco
        salaDAO.updateJogadoresByIdSala(room, numClients, function(error, results, fields) {
          if (error) {
            console.log(error);
            return
          } else
            console.log('sala atualizada ao um usuario sair');
        });
      }
      //atualizar a contagem de jogadores na partida
      io.to(room).emit('room users', numClients);

      console.log('jogador saiu');
    });
  });
}

module.exports.sala = function(app, req, res) {
  var moment = require('moment')
  verificarPermicao(req, function(err) {
    if (err)
      res.redirect('/');
    else {
      var pool = app.config.dbConnection;
      var salaDAO = new app.app.model.salaDAO(pool);

      salaDAO.findAll(async function(error, results, fields) {
        if (error)
          throw error;
        else {
          var findAllAtivas = results;
          salaDAO.findAll2(async function(error, results, fields) {
            if (error)
              throw error;
            else {
              var findAllFinalizadas = results;
              res.render('sala', {
                finalizadas: findAllAtivas,
                naoFinalizadas: findAllFinalizadas,
                sala: req.params.sala,
                session: req.session,
                moment:moment
              });
            }
          });
        }
      });
    }
  });
}


module.exports.entrarSala = function(app, req, res) {
  verificarPermicao(req, function(err) {
    if (err)
      res.redirect('/');
    else {
      var pool = app.config.dbConnection;
      var salaDAO = new app.app.model.salaDAO(pool);
      console.log(req.params.sala);
      salaDAO.findById(req.params.sala, function(error, results, fields) {
        if (error) {
          console.log(error);
          return
        }

        if (results.length >= 1) {
          if (results[0].QTD_JOGADORES < 6) {

            if (results[0].ID_STATUS == 1) {
              res.render('partida', {
                session: req.session,
                salaNome: results[0].NM_SALA
              });
            } else
              res.send('Sala não está em espera');

          } else
            res.send('Sala está cheia');
        } else
          res.send('Sala não existe');
      });
    }
  });
}

module.exports.criarSala = function(app, req, res) {
  var nome = req.param('txtNome');
  var pool = app.config.dbConnection;
  var salaDAO = new app.app.model.salaDAO(pool);

  salaDAO.insert(nome, function(error, results, fields) {
    if (error) {
      console.log(error);
      return
    } else {
      var salaID = results.insertId;
      res.redirect('/sala/' + salaID);
    }
  });
}
