var steam = require('steam-login');

module.exports = function(app){
  app.get('/verify', steam.verify(), function(req,res){
    var pool = app.config.dbConnection;
    var steamDAO = new app.app.model.JogadorDAO(pool);
    var battlerite = app.config.battlerite;
    var steamID = req.user.steamid;

    var sessoes = function sessao(){
      steamDAO.findBySteam64(steamID,async function(err, result){
        if (err) {
          throw err;
        }
        req.session.sessaoAutorizada = true;
        req.session.steamid = result.rows[0].steam64;
        req.session.nick = result.rows[0].nm_jogador;
        req.session.btrid = result.rows[0].btrid;
        req.session.verificarSessao = true;
        res.redirect('/');
      });
    }


    steamDAO.findBySteam64(req.user.steamid,async function(err, result){
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
            var nick = response.data[0].attributes.name;
            steamDAO.insert(steamID, btrID, nick,async function(err, result){
              if (err) {
                console.log(err);
              }
              sessoes();
            })
          }).catch((error) => {
              console.log(error.response.status);
          });
        }else {
          sessoes();
        }
      }
  });/*
  setTimeout(function(){
    res.redirect('/');
  },1500);*/
});
}
