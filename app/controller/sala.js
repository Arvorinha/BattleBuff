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

  io.on('connection', function(socket) {
    console.log('jogador entrou');

    //ao jogador entrar na partida enviar o id
    socket.on('room', function(room) {
      socket.room = room;
      socket.join(room);
      //checar número de jogadores dentro da partida
      var clients = io.sockets.adapter.rooms[room].sockets;
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
    });

    //receber dados do jogador
    socket.on('new user', function(btrid, nome, img, rank, room) {
      socket.btrid = btrid;
      socket.img = img;
      socket.nome = nome;
      socket.rank = rank;

      var clients = io.sockets.adapter.rooms[room].sockets;
      var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
      var key = 'jogador';
      var key2 = 'capitao';

      io.sockets.adapter.rooms[room].picks = {};
      io.sockets.adapter.rooms[room].picks[key] = [];

      io.sockets.adapter.rooms[room].time1 = {};
      io.sockets.adapter.rooms[room].time1[key] = [];
      io.sockets.adapter.rooms[room].time1[key2] = [];

      io.sockets.adapter.rooms[room].time2 = {};
      io.sockets.adapter.rooms[room].time2[key] = [];
      io.sockets.adapter.rooms[room].time2[key2] = [];

      for (var clientId in clients) {
        var clientSocket = io.sockets.connected[clientId];
        var data = {
          id: clientSocket.btrid,
          nome: clientSocket.nome,
          rank: '6',
          idimg: clientSocket.img
        };
        io.sockets.adapter.rooms[room].picks[key].push(data);
      }

      console.log(io.sockets.adapter.rooms[room].picks[key]);

      io.to(room).emit('list users',
        io.sockets.adapter.rooms[room].picks,
        io.sockets.adapter.rooms[room].time1,
        io.sockets.adapter.rooms[room].time2);

    });

    //ao jogador desconectar da partida
    socket.on('disconnect', function() {
      room = socket.room;

      //checar número de jogadores dentro da partida
      if (io.sockets.adapter.rooms[room] === undefined) {
        numClients = 0;
        //deletar sala no banco se n tiver jogadores
        salaDAO.deleteSalaById(room, function(error, results, fields) {
          if (error) {
            console.log(error);
            return
          } else
            console.log('sala deletada ao um usuario sair');
        });
      } else {
        clients = io.sockets.adapter.rooms[room].sockets;
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
          res.render('sala', {
            results: results,
            sala: req.params.sala,
            session: req.session
          });
        }
      });
    }
  });
}


module.exports.entrarSala = function(app, req, res) {
  // verificarPermicao (req, function (err) {
  //   if (err)
  //     res.redirect('/');
  //   else {
  //     var pool = app.config.dbConnection;
  //     var salaDAO = new app.app.model.salaDAO(pool);
  //     console.log(req.params.sala);
  //     salaDAO.findById(req.params.sala, function(error, results, fields){
  //       if(error){
  //         console.log(error);
  //         return
  //       }
  //       else {
  //         if(results.length >= 1){
  //           res.render('checksala', {
  //             sala : req.params.sala,
  //             session:req.session
  //           });
  //         }else {
  res.render('partida', {
    session: req.session,
    btrid: 1213123,
    img: 2332,
    nick: 'Balaco'
  });
  //         }
  //       }
  //     });
  //   }
  // });
}

module.exports.checarSala = function(app, req, res) {
  verificarPermicao(req, function(err) {
    if (err)
      res.redirect('/');
    else {
      var request = require('request');

      if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.json({
          "responseError": "Please select captcha first"
        });
      }
      const secretKey = "6LeNJnAUAAAAAEmge1THTYE0YavVuuCTYM4-2xUr";

      const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

      request(verificationURL, function(error, response, body) {
        body = JSON.parse(body);

        if (body.success !== undefined && !body.success) {
          res.render('checksala', {
            erros: "",
            sala: req.params.sala,
            session: req.session
          });
          return;
        }
        res.render('partida', {
          session: req.session
        });
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
