var r = require('rethinkdb')
var env = process.env.NODE_ENV || 'development'
var conf = require('../../../config.json')[env].rethinkdb

module.exports = {

  name: 'Xls',

  read: function(req, resource, params, config, callback) {
    // Połącz się z bazą danych `sdm`
    r.connect(conf, function(error, conn){
      if(error) { // Wystąpił błąd przy połączeniu z bazą danych
        callback(error)
        return
      }

      if(params.email) { // Pobierz krotkę o danym numerze id
        r.table('Imports').getAll(params.email.toString(), {index: 'rg_email'}).run(conn, function(err, cursor){
          if(err) {
            callback(err)
          } else {
            cursor.toArray(function(err, array) {
              callback(err, array[0])
            })
          }
        })
      } else {
        callback(400)
      }
    })
  }
}
