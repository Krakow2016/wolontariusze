'use strict'

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var bcrypt = require('bcrypt')

var env = process.env.NODE_ENV || 'development'
var config = require('./config.json')[env]
var Volunteers = require('./app/services/volunteers')(config.service)

var admin = {
  user: { id: '', is_admin: true }
}

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(new LocalStrategy(
  function(username, password, done) {
    // Próba logowania
    Volunteers.read(admin, 'Volunteers', { key: username }, { index: 'email' }, function (err, users) {
      // Wystąpił niespodziewany błąd
      if (err) { return done(null, false, err) }
      var user = users[0]
      // Nie znaleziono użytkownika o danym loginie
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' })
      }
      // Sprawdź poprawność hasła
      bcrypt.compare(password, user.password, function(err, res) {
        if (!res) {
          return done(null, false, { message: 'Incorrect password.' })
        } else if (!user.approved) {
          return done(null, false, { message: 'You have been banned.' })
        } else {
          // Zalogowano poprawnie, zwróć obiekt zalogowanego użytkownika
          return done(null, user, { message: 'Welcome!' })
        }
      })
    })
  }
))

// Zdefiniuj metodę przechowywania referencji do obiektu zalogowanego
// użytkownika. Ta zmienna będę skojarzona z sesją użytkownika i przechowywana
// w pamięci serwera.
passport.serializeUser(function(user, done) {
  done(null, user.id)
})

// Zdefiniuj metodę odtworzenia obiektu użytkownika na podstawie wcześniej
// zapamiętanej referencji (numeru id w bazie danych).
passport.deserializeUser(function(id, done) {
  Volunteers.read(admin, 'Volunteers', { id: id }, {}, function (err, user) {
    done(err, user)
  })
})
