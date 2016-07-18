'use strict'
var env = process.env.NODE_ENV || 'development'
var conf = require('../../../config.json')[env].rethinkdb

// Konfiguracja bazy danych
var r = require('rethinkdbdash')({
  servers: [ conf ]
})

// Nakładka na serwisy danych ograniczająca dostęp do prywatnych atrybutów
var Protect = require('../helpers/protect')

module.exports = Protect({
  name: 'Comments',
  read: function(req, resource, params, config, callback) {
    r.table('Comments')
      .filter({
        volunteerId: params.volunteerId.toString()
      })
      // Dołącz imię i nazwisko autora z tabeli wolontariuszy
      .eqJoin('adminId', r.table('Volunteers'))
      .pluck({ // Ogranicz do tylko wybranych atrybutów
        left: true, // Wszystkie parametry z tabeli komentarzy
        right: ['first_name', 'last_name'] // Tylko imię i nwzwisko autora
      })
      .zip()
      .limit(50)
      .orderBy(r.desc('creationTimestamp')) // Sortowanie
      .run().then(function(result) {
        callback(null, result)
      })
  },

  create: function(req, resource, params, body, config, callback) {
    params.adminId = req.user.id
    params.creationTimestamp = Date.now()

    r.table(resource).insert(params, {returnChanges: true}).run().then(function(result) {
      callback(null, result.changes.map(function(change) {
        var new_val = change.new_val
        // Dołącz dane autora komentarza
        new_val.first_name = req.user.first_name
        new_val.last_name = req.user.last_name
        return new_val
      }))
    })
  },

  update: function(req, resource, params, body, config, callback) {
    r.table(resource)
      .get(body.id)
      .update({raw: body.raw})
      .run().then(function(result) {
        callback(null, result)
      })
  },

  delete: function(req, resource, params, config, callback) {
    r.table(resource).get(params.id).delete().run().then(function(result){
      callback(null, result)
    })
  }
})
