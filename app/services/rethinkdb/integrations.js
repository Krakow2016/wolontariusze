var r = require('rethinkdb')

var conf = require('../../../config.json').rethinkdb
var debug = require('debug')('Server')

// Nakładka na serwisy danych ograniczająca dostęp do prywatnych atrybutów
var Protect = require('../../../lib/protect')

module.exports = Protect({

  name: 'Integrations',

  read: function(req, resource, params, config, callback) {
    r.connect(conf, function(error, conn){
      if(error) { // Wystąpił błąd przy połączeniu z bazą danych
        callback(error)
        return
      }

      var id = params.user_id
      if(!id) { return callback("Błąd: Brak parametru `user_id`.") }

      // Pobierz klientów API którzy mają uprawnienia do komunikacji z serwisem
      // w imieniu użytkownika.
      r.table("APITokens")
        .getAll(id, {index: 'userId'})
        .eqJoin("clientId", r.table("APIClients"))
        .pluck({"right": "name", "left": "id"})
        .zip()
        .run(conn, function(err, cursor){

        if(err) { callback(err) }
        else { cursor.toArray(callback) }
      })
    })
  }

})
