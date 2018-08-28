const BattleriteAPI = require('battlerite-api');
const api = new BattleriteAPI({
  apiKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI5OTFiZGQwMC04MzE4LTAxMzYtY2Q5ZC0wYTU4NjQ2MDA2MjgiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTM0Mzc5MDQxLCJwdWIiOiJzdHVubG9jay1zdHVkaW9zIiwidGl0bGUiOiJiYXR0bGVyaXRlIiwiYXBwIjoidGVzdC02YjVkOTg3ZS05YTRmLTQxYTMtOTZhYy01NzVlMmJmMTBiYWMiLCJzY29wZSI6ImNvbW11bml0eSIsImxpbWl0IjoxMH0.YuEfTLYI64cGq__6qnSSqtXSmKCR_CYGQZnKzKfXdmA',
});

module.exports = function(app){
  app.get('/', function(req,res){
    var pool = app.config.dbConnection;
    var steam = app.app.model.jogadorModel;
    var btsids = [];
    steam.findAll(pool, function(err,result){
      if(err){
        console.log(err.stack);
      }
      else{
        if (result.rowCount != 0) {

          for(var i=0; i < result.rowCount ; i++){
            btsids.push(result.rows[i].btrid);
          }

          api.getPlayersByIds(btsids).then((response) => {
              var results = response.data;
              res.render('index', { response: results });
          }).catch((error) => {
              console.log(error.response.status);
          });

        } else {
          res.render('index');
        }
      }
    })
  });
}
