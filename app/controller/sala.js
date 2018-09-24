function verificarPermicao (req, done) {
  //checar se o usuário está logado
  if (req.session.verificarSessao){
    //destruir sessão
    if (typeof req.query.sair != "undefined" && req.query.sair == "sim") {
      req.session.destroy();
    }
    //checar se o usuário tem permição
    else {
      if (typeof req.session.autenticado == 'undefined')
       return done (Error ('NAO-AUTENTICADO'));
      else
        return done (null);
    }
  }
  else
    return done (Error ('NAO-LOGADO'));
}

var io;
module.exports.salaID = function(importIO, app) {
  var pool = app.config.dbConnection;
  var salaDAO = new app.app.model.salaDAO(pool);
  var io = importIO;

  io.on('connection', function(socket){
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
      salaDAO.updateJogadoresByIdSala(room, numClients,function(err,result){
        if(err){
          console.log(err);
          return
        }
        else
          console.log('sala atualizada ao um usuario entrar');
      });
    });

    //atualizar a contagem de jogadores na partida
    socket.on('room users', function(userlist) {
      io.emit('room users', userlist);
    });

    //ao jogador desconectar da partida
    socket.on('disconnect', function(){
      room = socket.room;

      //checar número de jogadores dentro da partida
      if (io.sockets.adapter.rooms[room] === undefined){
        numClients = 0;
        //deletar sala no banco se n tiver jogadores
        salaDAO.deleteSalaById(room,function(err,result){
          if(err){
            console.log(err);
            return
          }
          else
            console.log('sala deletada ao um usuario sair');
        });
      }else {
        clients = io.sockets.adapter.rooms[room].sockets;
        numClients = Object.keys(clients).length;
        //atualizar a contagem de jogadores no banco
        salaDAO.updateJogadoresByIdSala(room, numClients,function(err,result){
          if(err){
            console.log(err);
            return
          }else
            console.log('sala atualizada ao um usuario sair');
        });
      }
      //atualizar a contagem de jogadores na partida
      io.to(room).emit('room users', numClients);

      console.log('jogador saiu');
    });
  });
}

module.exports.sala = function(app,req,res){
  verificarPermicao (req, function (err) {
    if (err)
      res.redirect('/');
    else {
      var pool = app.config.dbConnection;
      var salaDAO = new app.app.model.salaDAO(pool);

      salaDAO.findAll(async function(err, result){
        if (err)
          throw err;
        else {
          res.render('sala', {
            results: result.rows,
            sala : req.params.sala,
            sessao : req.session.verificarSessao,
            nick : req.session.nick ,
            steamid : req.session.steamid,
            btrid : req.session.btrid,
            img : req.session.img});
        }
      });
    }
  });
}

module.exports.entrarSala = function(app,req,res){
  verificarPermicao (req, function (err) {
    if (err)
      res.redirect('/');
    else {
      var pool = app.config.dbConnection;
      var salaDAO = new app.app.model.salaDAO(pool);
      salaDAO.findById(req.params.sala, function(err,result){
        if(err){
          console.log(err);
          return
        }
        else {
          if(result.rows.length >= 1){
            res.render('checksala', {
              sala : req.params.sala,
              sessao : req.session.verificarSessao,
              nick : req.session.nick,
              steamid : req.session.steamid,
              btrid : req.session.btrid,
              img : req.session.img
            });
          }else {
            res.redirect('/sala');
          }
        }
      });
    }
  });
}

module.exports.checarSala = function(app,req,res){
  verificarPermicao (req, function (err) {
    if (err)
      res.redirect('/');
    else {
      var request = require('request');

      if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null)
      {
        return res.json({"responseError" : "Please select captcha first"});
      }
      const secretKey = "6LeNJnAUAAAAAEmge1THTYE0YavVuuCTYM4-2xUr";

      const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

      request(verificationURL,function(error,response,body) {
        body = JSON.parse(body);

        if(body.success !== undefined && !body.success) {
          res.render('checksala', {
            erros : "",
            sala : req.params.sala,
            sessao : req.session.verificarSessao,
            nick : req.session.nick,
            steamid : req.session.steamid,
            btrid : req.session.btrid,
            img : req.session.img
          });
          return;
        }
        res.render('partida');
      });
    }
  });
}

module.exports.criarSala = function(app,req,res){
  var nome = req.param('txtNome');
  var pool = app.config.dbConnection;
  var salaDAO = new app.app.model.salaDAO(pool);

  salaDAO.insert(nome, 'Espera',function(err,result){
    if(err){
      console.log(err);
      return
    }
    else {
      var salaID = result.rows[0].id;
      res.redirect('/sala/' + salaID);
    }
  });
}
