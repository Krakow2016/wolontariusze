// The service code that you write is always executed on the server, but can be
// accessed transparently from actions without any knowledge of whether it's on
// the server or client. Fetchr provides an appropriate abstraction so that you
// can fetch (CRUD) the data needed in your stores using the same exact syntax
// on server and client side.
//
// Więcej: http://fluxible.io/guides/data-services.html

var r = require('rethinkdb')

module.exports = {

  name: 'Volonteers',

  read: function(req, resource, params, config, callback) {
    // Połącz się z bazą danych `sdm`
    r.connect({db: 'sdm'}, function(error, conn){
      if(error) { // Wystąpił błąd przy połączeniu z bazą danych
        callback(error)
        return
      }

      if(params.id) { // Pobierz krotkę o danym numerze id
        r.table('Volonteers').get(params.id).run(conn, function(err, row){
          console.log(err, row)
          callback(err || !row, row)
        })
      } else { // Pobierz listę krotek
        if(params.email) { // use index
          r.table('Volonteers').getAll(params.email, {index: 'email'}).run(conn, function(err, cursor) {
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
    r.connect({db: 'sdm'}, function(err, conn) {
      if(err) {
        callback(err)
        return
      }

      r.table(resource).insert(params).run(conn, callback)
    })
  }

  // update: function(resource, params, body, config, callback) {},
  // delete: function(resource, params, config, callback) {}

}
