var env = process.env.NODE_ENV || 'development'
var conf = require('../../../config.json')[env].rethinkdb

// Konfiguracja bazy danych
var r = require('rethinkdbdash')({
  servers: [ conf ]
})

module.exports = {
  name: 'Xls',
  read: function(req, resource, params, config, callback) {
    if(params.email) { // Pobierz krotkę o danym numerze id
      r.table('Imports').getAll(params.email.toString(), {index: 'rg_email'}).run().then(function(result){
        callback(null, result[0])
      })
    } else {
      callback(400)
    }
  }
}
