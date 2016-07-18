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
  name: 'Integrations',
  read: function(req, resource, params, config, callback) {
    var id = params.user_id
    if(!id) { return callback('Błąd: Brak parametru `user_id`.') }

    // Pobierz klientów API którzy mają uprawnienia do komunikacji z serwisem
    // w imieniu użytkownika.
    r.table('APITokens')
      .getAll(id.toString(), {index: 'userId'})
      .eqJoin('clientId', r.table('APIClients'))
      .pluck({'right': 'name', 'left': ['id', 'userId']})
      .zip()
      .run().then(function(result){
        callback(null, result)
      })
  }
})
