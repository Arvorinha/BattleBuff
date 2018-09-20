module.exports = function(app){
  app.get('/sala/:sala', function (req, res) {
    app.app.controller.sala.entrarSala(app,req,res);
  });

  app.post('/sala/:sala', function (req, res) {
    app.app.controller.sala.checarSala(app,req,res);
  });

  app.get('/sala', function (req, res) {
    app.app.controller.sala.sala(app,req,res);
  });

  app.post('/criar-sala', function (req, res) {
    app.app.controller.sala.criarSala(app,req,res);
  });
}
