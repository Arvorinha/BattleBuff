var app = require('./config/server');
//var home = require('./app/routes/steam/home')(app);
//var home = require('./app/routes/steam/auth')(app);
//var home = require('./app/routes/steam/verify')(app);
var port = process.env.PORT || 5000

var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
  console.log('a user connected');


  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


http.listen(port, function(){
  console.log(`Servidor Rodando na porta ${ port }`);
});
// app.listen(port, () => console.log(`Servidor Rodando na porta ${ port }`));
