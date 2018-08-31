module.exports = function(app){
  app.get('/agua', function(req,res){
    console.log('a');
    res.render('main');
  });
  app.get('/', function(req,res){
    var pool = app.config.dbConnection;
    var steamDAO = new app.app.model.JogadorDAO(pool);
    var battlerite = app.config.battlerite;
    var btsids = [];

    steamDAO.findAll(function(err,result){
      if(err){
        console.log(err.stack);
      }
      else{
        if (result.rowCount != 0) {

          for(var i=0; i < result.rowCount ; i++){
            btsids.push(result.rows[i].btrid);
          }

          battlerite().getPlayersByIds(btsids).then((response) => {
              var results = response.data;
              if(req.session.verificarSessao != 'undefined')
                res.render('index', { response: results, sessao : req.session.verificarSessao});
              else
                res.render('index', { response: results, sessao : false});
          }).catch((error) => {
              console.log(error.response.status);
          });

        } else {
          res.render('index', { sessao : false});
        }
      }
    })
  });
}
