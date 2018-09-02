var steam = require('steam-login');

module.exports = function(app){
  app.get('/verify', steam.verify(), function(req,res){
    app.app.controller.verify.verify(app, req, res);
  });
}
