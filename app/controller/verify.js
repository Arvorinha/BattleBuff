module.exports.verify = function(app, req ,res){
  var pool = app.config.dbConnection;
  var steamDAO = new app.app.model.JogadorDAO(pool);
  var battlerite = app.config.battlerite;
  var steamID = req.user.steamid;

  var sessoes = function(){
    steamDAO.findBySteam64(steamID,async function(err, result){
      if (err) {
        throw err;
      }
      req.session.sessaoAutorizada = true;
      req.session.steamid = result.rows[0].steam64;
      req.session.btrid = result.rows[0].btrid;
      req.session.verificarSessao = true;
      res.redirect('/');
    });
  }


  steamDAO.findBySteam64(req.user.steamid, function(err, result){
    if(err){
      console.log(err.stack);
    }
    else {
      //Remove sessao criada pelo pacote steam-login
      delete req.session.steamUser;
      req.user = null;
      /*********************************************/
      if (result.rowCount == 0) {
        battlerite().getPlayerBySteamId(steamID).then((response) => {
          var btrID = response.data[0].id;
          nick = response.data[0].attributes.name;
          img = response.data[0].attributes.stats.picture;
          steamDAO.insert(steamID, btrID, function(err, result){
            if (err) {
              console.log(err);
            }
            req.session.nick = nick;
            req.session.img = img;
            sessoes();
          })
        }).catch((error) => {
            console.log(error.response.status);
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
