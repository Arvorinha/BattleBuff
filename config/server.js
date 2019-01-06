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
    realm: 'http://battlebuff-breno-projects.7e14.starter-us-west-2.openshiftapps.com', //http://localhost:5000
    verify: 'http://battlebuff-breno-projects.7e14.starter-us-west-2.openshiftapps.com/verify', //http://localhost:5000/verify
    apiKey: '69FC736459FCC5094E6CE76DCD0A466D'}
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
