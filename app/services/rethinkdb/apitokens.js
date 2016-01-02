'use strict'

var r = require('rethinkdb')

var conf = require('../../../config.json').rethinkdb

// Nakładka na serwisy danych ograniczająca dostęp do prywatnych atrybutów
var Protect = require('../../../lib/protect')

module.exports = Protect({

  name: 'APITokens',

  read: function(req, resource, params, config, callback) {
    r.connect(conf, function(error, conn){
      if(error) { // Wystąpił błąd przy połączeniu z bazą danych
        callback(error)
        return
      }

      if(params.id) { // Pobierz krotkę o danym numerze id
        r.table('APITokens').get(params.id).run(conn, function(err, row){
          callback(err || !row, row)
        })
      }
    })
  }
})
