module.exports = function(app){
  app.get('/partida/:partidaID', function (req, res) {
    app.app.controller.partida.resultadoPartida(app,req,res);
  });
}
