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

  name: 'APITokens',

  read: function(req, resource, params, config, callback) {
    if(params.id) { // Pobierz krotkę o danym numerze id
      r.table('APITokens').get(params.id).run().then(function(row){
        if(!row) {
          callback(404)
        } else {
          callback(null, row)
        }
      })
    }
  }
})
