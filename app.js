var app = require('./config/server');
//var home = require('./app/routes/steam/home')(app);
//var home = require('./app/routes/steam/auth')(app);
//var home = require('./app/routes/steam/verify')(app);
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 5000;
var ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var http = require('http').Server(app);
var io = require('socket.io')(http);
app.app.controller.sala.salaID(io, app);

http.listen(port, ip, function() {
  console.log('Server running on http://%s:%s', ip, port);
});
// app.listen(port, () => console.log(`Servidor Rodando na porta ${ port }`));
// app.listen(port, ip);
// console.log('Server running on http://%s:%s', ip, port);
