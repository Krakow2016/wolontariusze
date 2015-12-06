/**
 * Module dependencies.
 */
var express = require('express')
var passport = require('passport')
var util = require('util')
var bodyParser = require('body-parser')
var session = require('express-session')

var config = require('./config.json')
var oauth2 = require('./oauth/oauth2')

// Express configuration

var server = express();

server.set('view engine', 'ejs');
server.set('views', process.cwd() + '/oauth/views')
//server.use(express.logger());
//server.use(express.cookieParser());
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(session({ secret: 'keyboard cat' }))
/*
server.use(function(req, res, next) {
  console.log('-- session --');
  console.dir(req.session);
  //console.log(util.inspect(req.session, true, 3));
  console.log('-------------');
  next()
});
*/
server.use(passport.initialize());
server.use(passport.session());
//server.use(server.router);
//server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// Passport configuration

require('./auth');
require('./oauth/auth');

// Formularz do logowania dla wolontariuszy chcących dać dostęp do swojego
// konta wybranej aplikacji.
server.get('/login', function(req, res) { res.render('login') })
server.post('/login', passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login'
}))

server.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
})

// Okienko w którym wolontariusz wyraża zgodę (lub nie) na dostęp do swojego
// konta.
server.get('/dialog/authorize', oauth2.authorization);
server.post('/dialog/authorize/decision', oauth2.decision);

// Końcówka dla klienta oauth chcącego zamienić tymczasowy kod dostępu na
// token.
server.post('/oauth/token', oauth2.token);

server.get('/client', passport.authenticate('bearer', { session: false }), function(req, res) {
  res.json({
    client_id: req.user.id,
    scope: req.authInfo.scope
  })
})

server.listen(config.api_port);
