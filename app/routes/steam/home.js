module.exports = function(app){
  app.get('/', function(req,res){
    app.app.controller.home.index(app, req, res);
  });

  app.post('/registerKey',function(req,res){
    app.app.controller.home.registerKey(app,req,res);
  })
}
