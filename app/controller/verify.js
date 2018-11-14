module.exports.verify = function(app, req ,res){
  var pool = app.config.dbConnection;
  var steamDAO = new app.app.model.JogadorDAO(pool);
  var keyDAO = new app.app.model.keyDAO(pool);
  var adminDAO = new app.app.model.AdminDAO(pool);
  var battlerite = app.config.battlerite;
  var steamID = req.user.steamid;

  var sessoes = function(){
    steamDAO.findBySteam64(steamID,async function(error, results, fields){
      if (error) {
        throw error;
      }
      req.session.sessaoAutorizada = true;
      req.session.id_jogador = results[0].ID_JOGADOR;
      var userid = results[0].ID_JOGADOR;
      req.session.steamid = results[0].STEAM64;
      req.session.btrid = results[0].BTRID;
      req.session.verificarSessao = true;
      keyDAO.findByIdJogador(req.session.id_jogador,function(error, results, fields){
        if (error) {
          throw error;
        }
        if (results.length > 0) {
          if (results[0].ID_JOGADOR == req.session.id_jogador) {
            req.session.autenticado = true;
          }
        }
      adminDAO.findById(userid ,function(error, results, fields){
        if (error) {
          throw error;
        }
        if (results.length > 0) {
          req.session.sessaoAdmin = true;
          //console.log(req.session.sessaoAdmin + 'a');
          res.redirect('/');
        }
        else{
          res.redirect('/');
        }
      });
    });
    });
  }


  steamDAO.findBySteam64(req.user.steamid, function(error, results, fields){
    if(error){
      console.log(error.stack);
    }
    else {
      //Remove sessao criada pelo pacote steam-login
      delete req.session.steamUser;
      req.user = null;
      /*********************************************/
      if (!results.length > 0) {
        battlerite().getPlayerBySteamId(steamID).then((response) => {
          var btrID = response.data[0].id;
          nick = response.data[0].attributes.name;
          img = response.data[0].attributes.stats.picture;
          steamDAO.insert(steamID, btrID, function(error, results, fields){
            if (error) {
              console.log(error);
            }
            req.session.nick = nick;
            req.session.img = img;
            sessoes();
          })
        }).catch((error) => {
          req.session.erros = error.response.status;
          return res.redirect('/error')
        });
      }else {
        battlerite().getPlayerBySteamId(steamID).then((response) => {
          req.session.nick = response.data[0].attributes.name;
          req.session.img = response.data[0].attributes.stats.picture;
          sessoes();
        }).catch((error) => {
            console.log(error.response.status);
        });
      }
    }
});/*
setTimeout(function(){
  res.redirect('/');
},1500);*/
}
