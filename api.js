'use strict'

/**
 * Module dependencies.
 */
var express = require('express')
var passport = require('passport')
var util = require('util')
var bodyParser = require('body-parser')
var expressSession = require('express-session')

var env = process.env.NODE_ENV || 'development'
var config = require('./config.json')[env]
var oauth2 = require('./oauth/oauth2')

var Volunteer = require('./app/services/'+config.service+'/volonteers')

// Express configuration

var session = [expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}), passport.initialize(), passport.session()]

// Format każdego poprawnie wykonanego zapytania
var success = function(data) {
  return {
    status: 'success',
    data: data
  }
}

// Format każdego niepoprawnie wykonanego zapytania
var error = function(type, message) {
  var result = {
    status: 'error',
    type: type
  }
  if(message) {
      result.message = message
  }
  return result
}

var server = module.exports = express();

server.set('view engine', 'ejs');
server.set('views', process.cwd() + '/oauth/views')
//server.use(express.logger());
//server.use(express.cookieParser());
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
/*
server.use(function(req, res, next) {
  console.log('-- session --');
  console.dir(req.session);
  //console.log(util.inspect(req.session, true, 3));
  console.log('-------------');
  next()
});
*/
//server.use(server.router);
//server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// Passport configuration

require('./auth');
require('./oauth/auth');

// Formularz do logowania dla wolontariuszy chcących dać dostęp do swojego
// konta wybranej aplikacji.
server.get('/api/v2/login', session, function(req, res) { res.render('login') })
server.post('/api/v2/login', session, passport.authenticate('local', {
  successReturnToOrRedirect: '/api/v2/',
  failureRedirect: '/api/v2/login'
}))

server.get('/api/v2/logout', session, function(req, res) {
  req.logout()
  res.redirect('/api/v2/')
})

// Okienko w którym wolontariusz wyraża zgodę (lub nie) na dostęp do swojego
// konta.
server.get('/api/v2/dialog/authorize', session, oauth2.authorization);
server.post('/api/v2/dialog/authorize/decision', session, oauth2.decision);

// Końcówka dla klienta oauth chcącego zamienić tymczasowy kod dostępu na
// token.
server.post('/api/v2/oauth/token', oauth2.token);

// Autoryzacja tokenem oAuth
var bearer = [passport.initialize(), function(req, res, next) {
  passport.authenticate('bearer', { session: false }, function(err, user, info) {
    // Wystąpił błąd
    if (err) {
      return next(err) // status: 500
    }
    // Niezalogowany
    if (!user) {
      return res.status(401).send(error('Unauthorized'))
    }
    // Zaloguj
    req.logIn(user, function(err) {
      next() // Kontynuuj
    })
  })(req, res, next)
}]

// Wiadomość powitalna
server.get('/api/v2/', bearer, function(req, res) {
  res.send(success())
})

server.get('/api/v2/client', bearer, function(req, res) {
  res.json(success({
    client_id: req.user.id
  }))
})

// Dodawanie wolontariuszy
server.post('/api/v2/volunteers/', bearer, function(req, res) {
  // Sprawdź wymagane uprawnienia administratora
  if(!req.user || !req.user.is_admin) {
    return res.status(403).send(error('AdminRequired'))
  }

  Volunteer.create(req, 'Volunteers', {}, req.body, {}, function (err, volunteer) {
    if(err) { res.send(500) }
    else { res.status(201).send(success({volunteer: volunteer})) }
  })
})

// Lista wolontariuszy
server.get('/api/v2/volunteers', bearer, function(req, res) {
  Volunteer.read(req, 'Volunteers', {}, req.query, function (err, volunteers) {
    res.send(success({volunteers: volunteers}))
  })
})

// Szczegóły wolontariusza
server.get('/api/v2/volunteers/:id', bearer, function(req, res) {
  Volunteer.read(req, 'Volunteers', {id: req.params.id}, {}, function (err, volunteer) {
    res.send(success({volunteer: volunteer}))
  })
})

// Aktualizacja wolontariusza
server.post('/api/v2/volunteers/:id', bearer, function(req, res) {
  var id = req.params.id
  // Sprawdź wymagane uprawnienia administratora lub właściciela profilu
  if(!req.user || !(req.user.is_admin || req.user.id === id)) {
    return res.status(403).send(error('AdminRequired'))
  }

  Volunteer.update(req, 'Volunteers', {id: id}, req.body, {}, function (err, volunteer) {
    if(err) { res.send(500) }
    else { res.status(200).send(success({volunteer: volunteer})) }
  })
})

// Domyślna ścieżka
server.use(function(req, res, next) {
  res.status(404).send(error('PathNotFound'))
})

// Obsługa błędów
server.use(function(err, req, res, next) {
  console.error(err.stack)
  res.status(500).send(error('UnknownError', err))
})

// Lista zadań
//server.get('/tasks', bearer, function(req, res) { })

// Szczegóły zadania
//server.get('/tasks/:id', bearer, function(req, res) { })

// Zgłoszenie do zadania
//server.post('/tasks/:id/join', bearer, function(req, res) { })

// Baza noclegowa pielgrzymów
//server.get('/pilgrims', bearer, function(req, res) { })

if(__filename === process.argv[1]) {
  server.listen(config.api_port)
  console.log('Serwer został uruchomiony i jest dostępny pod adresem: http://127.0.0.1:'+config.api_port+'/.')
}
