var steam = require('steam-login');
module.exports = function(app){
  app.get('/auth', steam.authenticate(), function(req, res) {
    app.app.controller.steam.auth.auth(app, req, res)
});
}
