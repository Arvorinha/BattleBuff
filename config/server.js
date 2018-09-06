var express = require('express');
var app = express();
var steam = require('steam-login');
var consign = require('consign');
var expressSession = require('express-session');
var bodyParser = require('body-parser')

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(expressSession({
   resave: false,
   saveUninitialized: false,
   secret: 'wsatdgyfjdsfhgj'
}));
app.use(steam.middleware({
    realm: 'http://localhost:5000/',
    verify: 'http://localhost:5000/verify',
    apiKey: '69FC736459FCC5094E6CE76DCD0A466D'}
));
app.use(express.static('./app/views/public'));

consign()
  .include('app/routes')
  .then('config/dbConnection.js')
  .then('app/model')
  .then('app/controller')
  .then('config/battlerite.js')
  .into(app);

module.exports = app;
