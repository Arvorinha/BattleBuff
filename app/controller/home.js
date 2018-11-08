module.exports.index = function(app, req, res) {
  console.log(req.session);
  if (req.session.verificarSessao) {
    if (typeof req.query.sair != "undefined" && req.query.sair == "sim") {
      console.log(req.query.sair);
      delete req.session.id;
      delete req.session.steamid;
      delete req.session.verificarSessao;
      delete req.session.nick;
      delete req.session.btrid;
      delete req.session.img;
      res.redirect('/')
    } else {
      console.log(req.session.sessaoAdmin + 'b');
      res.render('index', {
        erros: "",
        session:req.session
      });
    }
  } else {
    res.render('index', {
      erros: "",
      session:req.session
    });
  }
}

module.exports.registerKey = function(app, req, res) {
  var pool = app.config.dbConnection;
  var keyDAO = new app.app.model.keyDAO(pool);
  var key = req.body.key;
  var key2 = key + key;
  if (!req.session.verificarSessao) {
    res.redirect('auth');
    return;
  }
  if (req.session.autenticado) {
    res.redirect('/');
  }
  req.assert('key', 'Insira uma key').notEmpty()
  req.assert('key', 'Formato de key incorreto').len(19, 19)

  var erros = req.validationErrors();
  if (erros) {
    res.render('index', {
      erros: erros,
      session:req.session
    })
    return;
  }

  keyDAO.findByKey(key, function(err, result) {
    if (err) {
      throw err;
    }
    if (result.rowCount) {
      if (result.rows[0].id_jogador > 0) {
        //Usando uma validação qualquer apenas para mostrar o erro pro usuario final
        req.assert('key', 'Key ja foi utilizada').len(1, 1);
        var keyUsada = req.validationErrors();
        if (keyUsada) {
          res.render('index', {
            erros: keyUsada,
            session:req.session
          })
          return;
        }
      } else {
        keyDAO.registerKey(req.session.id_jogador, key, function(err, result) {
          if (err) {
            throw err;
          }
          console.log(result);
          req.session.autenticado = true;
          res.redirect('/');
        })
      }
    } else {
      req.assert('key', "Nenhuma key encontrada").len(1, 1);
      var keyInvalida = req.validationErrors();
      if (keyInvalida) {
        res.render('index', {
          erros: keyInvalida,
          session:req.session
        })
        return;
      }
    }
  })
}
