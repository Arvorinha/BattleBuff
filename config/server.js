var express = require('express');
var app = express();
var steam = require('steam-login');
var consign = require('consign');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var expressFileUploader = require('express-fileupload')

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(expressValidator());

app.use(expressSession({
   resave: false,
   saveUninitialized: true,
   secret: 'wsatdgyfjdsfhgj',
   cookie: { maxAge: 10080000 }
}));
app.use(steam.middleware({
    realm: 'http://localhost:5000', //http://localhost:5000
    verify: 'http://localhost:5000/verify', //http://localhost:5000/verify
    apiKey: '6FD94CF61466A4FFB1277B7A8249BA8A'}
));

app.use(expressFileUploader());

app.use(express.static('./app/views/public'));

consign()
  .include('app/routes')
  .then('config/dbConnection.js')
  .then('app/model')
  .then('app/controller')
  .then('app/utils')
  .then('config/battlerite.js')
  .into(app);

module.exports = app;
