// The service code that you write is always executed on the server, but can be
// accessed transparently from actions without any knowledge of whether it's on
// the server or client. Fetchr provides an appropriate abstraction so that you
// can fetch (CRUD) the data needed in your stores using the same exact syntax
// on server and client side.
//
// Więcej: http://fluxible.io/guides/data-services.html

var r = require('rethinkdb')
var bcrypt = require('bcrypt')

var conf = require('../../../config.json').rethinkdb
var debug = require('debug')('Server')

// Nakładka na serwisy danych ograniczająca dostęp do prywatnych atrybutów
var Protect = require('../../../lib/protect')

module.exports = Protect({

  name: 'Volonteers',

  read: function(req, resource, params, config, callback) {
    // Połącz się z bazą danych `sdm`
    r.connect(conf, function(error, conn){
      if(error) { // Wystąpił błąd przy połączeniu z bazą danych
        callback(error)
        return
      }

      if(params.id) { // Pobierz krotkę o danym numerze id
        r.table('Volonteers').get(params.id).run(conn, function(err, row){
          callback(err || !row, row)
        })
      } else { // Pobierz listę krotek
        if(config.index) { // use index
          r.table('Volonteers').getAll(params.key, {index: config.index}).run(conn, function(err, cursor) {
            if(err) { callback(err) }
            else { cursor.toArray(callback) }
          })
        } else { // Brak identyfikatora
          // Zwróć wszyskich wolontariuszy
          r.table('Volonteers').limit(50).run(conn, function(err, cursor) {
            if(err) { callback(err) }
            else { cursor.toArray(callback) }
          })
        }
      }
    })
  },

  create: function(req, resource, params, body, config, callback) {
    // Połącz się z bazą danych `sdm`
    r.connect(conf, function(err, conn) {
      if(err) {
        callback(err)
        return
      }

      // Upewnij się, że podany email nie istnieje jeszcze w bazie danych
      r.table(resource).getAll(body.email, {index: 'email'}).run(conn, function(err, cursor) {
        if(err) { callback(err) }
        else {
          cursor.next(function(err, row) {
            // Brak emaila w bazie
            if (err) { r.table(resource).insert(body).run(conn, callback) }
            else { callback({message: 'Email is already in the database.'}) }
          })
        }
      })
    })
  },

  update: function(req, resource, params, body, config, callback) {
    var id = body.id || params.id
    // Błąd gdy brak id
    if(!id) {
      callback(400)
      return
    }
    // Połącz się z bazą danych `sdm`
    r.connect(conf, function(err, conn) {
      if(err) {
        callback(err)
        return
      }

      // Przepuść hasło przez funckję haszującą MD5
      if(body.password) {
        var salt = bcrypt.genSaltSync(10)
        // Zapisz hash w bazie danych (zawiera w sobie również sól)
        body.password = bcrypt.hashSync(body.password, salt)
        delete body.password_
      }

      // Wykonaj zapytanie do bazy danych
      r.table(resource).get(id).update(body).run(conn, callback)
    })
  },

  // delete: function(resource, params, config, callback) {}

})
