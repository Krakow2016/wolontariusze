'use strict'

// The service code that you write is always executed on the server, but can be
// accessed transparently from actions without any knowledge of whether it's on
// the server or client. Fetchr provides an appropriate abstraction so that you
// can fetch (CRUD) the data needed in your stores using the same exact syntax
// on server and client side.
//
// Więcej: http://fluxible.io/guides/data-services.html

//hasła dla wolontariuszy - https://www.dailycred.com/article/bcrypt-calculator
//faustyna@kowalska.pl  faustyna
//karol@wojtyla.pl  karol
//wolontariusz3@testowy.pl wolontariusz
//wolontariuszka4@testowa.pl wolontariuszka
//wolontariusz5@testowy.pl  wolontariusz

var utils = require('../../../oauth/utils')

// Nakładka na serwisy danych ograniczająca dostęp do prywatnych atrybutów
var Protect = require('../../../lib/protect')

var volunteers = require('./volonteers.json')

module.exports = Protect({
  name: 'Volonteers',
  // at least one of the CRUD methods is required
  read: function(req, resource, params, config, callback) {

    var volunteer
    if(params.id) {
      volunteer = volunteers[params.id]
    } else if(params.email) {
      var id = Object.keys(volunteers).filter(function(id) {
        var el = volunteers[id]
        return el.email === params.email
      })[0]

      volunteer = id ? [volunteers[id]] : null
    } else { // Brak identyfikatora
      // Zwróć wszyskich wolontariuszy
      var results = Object.keys(volunteers).map(function(key) {
        return volunteers[key]
      })
      callback(null, results)
      return
    }

    if(volunteer) {
      callback(null, volunteer)
    } else {
      callback('404')
    }
  },

  create: function(req, resource, params, body, config, callback) {
    var id = utils.uid(8)
    volunteers[id] = body

    var volunteer = body
    volunteer.id = id

    callback(null, volunteer)
  },

  update: function(req, resource, params, body, config, callback) {
    var volunteer = volunteers[params.id]
    Object.assign(volunteer, body)
    callback(null, volunteer)
  }

  // delete: function(req, resource, params, config, callback) {}
})
