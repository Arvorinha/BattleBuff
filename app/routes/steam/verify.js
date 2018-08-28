var steam = require('steam-login');
const BattleriteAPI = require('battlerite-api');
const api = new BattleriteAPI({
  apiKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI5OTFiZGQwMC04MzE4LTAxMzYtY2Q5ZC0wYTU4NjQ2MDA2MjgiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTM0Mzc5MDQxLCJwdWIiOiJzdHVubG9jay1zdHVkaW9zIiwidGl0bGUiOiJiYXR0bGVyaXRlIiwiYXBwIjoidGVzdC02YjVkOTg3ZS05YTRmLTQxYTMtOTZhYy01NzVlMmJmMTBiYWMiLCJzY29wZSI6ImNvbW11bml0eSIsImxpbWl0IjoxMH0.YuEfTLYI64cGq__6qnSSqtXSmKCR_CYGQZnKzKfXdmA',
});

module.exports = function(app){
  app.get('/verify',steam.verify(), function(req,res){
    var pool = app.config.dbConnection;
    var steam = app.app.model.jogadorModel;
    steam.findBySteam64(req.user.steamid, pool, function(err, result){
      if(err){
        console.log(err.stack);
      }
      else {
        console.log(result.rowCount);
        if (result.rowCount == 0) {
          var steamID = req.user.steamid;
          api.getPlayerBySteamId(steamID).then((response) => {
            var btrID = response.data[0].id;
            steam.insert(steamID, btrID, pool, function(err, result){
              if (err) {
                console.log(err);
              }
            })
          }).catch((error) => {
              console.log(error.response.status);
          });
        }
    }
  });/*
  setTimeout(function(){
    res.redirect('/');
  },1500);*/
  res.redirect('/');
});
}
