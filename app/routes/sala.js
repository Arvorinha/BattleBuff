module.exports = function(app){
  app.get('/sala/:sala', function (req, res) {
    app.app.controller.home.entrarsala(app,req,res);
  });

  app.get('/sala', function (req, res) {
    app.app.controller.home.sala(app,req,res);
  });
}
