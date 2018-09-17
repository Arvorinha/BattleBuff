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
      res.render('checksala', {
        sala : req.params.sala,
        sessao : req.session.verificarSessao,
        nick : req.session.nick,
        steamid : req.session.steamid,
        btrid : req.session.btrid,
        img : req.session.img
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
  })
}
