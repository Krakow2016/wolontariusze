var r = require('rethinkdb')

module.exports = {
  name: 'Comments',
  read: function(req, resource, params, config, callback) {
    // Połącz się z bazą danych `sdm`
    r.connect({db: 'sdm'}, function(error, conn){
      if(error) { // Wystąpił błąd przy połączeniu z bazą danych
        callback(error)
        return
      }

      r.table('Comments')
        .filter({volonteerId: params.volonteerId})
        // Dołącz imię i nazwisko autora z tabeli wolontariuszy
        .eqJoin('adminId', r.table('Volonteers'))
        .pluck({ // Ogranicz do tylko wybranych atrybutów
          left: true, // Wszystkie parametry z tabeli komentarzy
          right: ["first_name", "last_name"] // Tylko imię i nwzwisko autora
        })
        .zip()
        .limit(50)
        .orderBy('creationTimestamp') // Sortowanie
        .run(conn, function(err, cursor) {
          if(err) { callback(err) }
          else { cursor.toArray(callback) }
        })
    })
  },

  create: function(req, resource, params, body, config, callback) {
    // Połącz się z bazą danych `sdm`
    r.connect({db: 'sdm'}, function(err, conn) {
      if(err) {
        callback(err)
        return
      }

      params.adminId = req.user.id
      params.creationTimestamp = Date.now()

      r.table(resource).insert(params, {returnChanges: true}).run(conn, function(err, result) {
        if(err) { callback(err) }
        else {
          callback(null, result.changes.map(function(change) {
            var new_val = change.new_val
            // Dołącz dane autora komentarza
            new_val.first_name = req.user.first_name
            new_val.last_name = req.user.last_name
            return new_val
          })
)
        }
      })
    })
  },

  update: function(req, resource, params, body, config, callback) {
    // Połącz się z bazą danych `sdm`
    r.connect({db: 'sdm'}, function(err, conn) {
      if(err) {
        callback(err)
        return
      }

      r.table(resource).update({text: params.text}).run(conn, callback)
    })
  },

  delete: function(req, resource, params, config, callback) {
    // Połącz się z bazą danych `sdm`
    r.connect({db: 'sdm'}, function(err, conn) {
      if(err) {
        callback(err)
        return
      }

      r.table(resource).get(params.id).delete().run(conn, callback)
    })
  }
}
