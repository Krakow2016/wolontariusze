'use strict'
var env = process.env.NODE_ENV || 'development'
var conf = require('../../../config.json')[env].rethinkdb
var utils = require('../../../oauth/utils')

// Konfiguracja bazy danych
var r = require('rethinkdbdash')({
  servers: [ conf ]
})

module.exports = {

  name: 'APIClients',

  read: function(req, resource, params, config, callback) {
    if(params.id) { // Pobierz krotkę o danym numerze id
      r.table('APIClients').get(params.id).run().then(function(row){
        if(!row) {
          callback(404)
        } else {
          callback(null, row)
        }
      })
    } else { // Pobierz listę krotek
      var id = params.user_id.toString() // TODO: użyj tej samej konwencji do indeksów co w serwisie wolontariusza
      if(!id) { return callback('Błąd: Brak parametru `user_id`.') }

      // Pobierz klientów API stworzonych przez użytkownika
      r.table('APIClients')
      .getAll(id, {index: 'user_id'})
      .run().then(function(result){
        callback(null, result)
      })
    }
  },

  create: function(req, resource, params, body, config, callback) {
    body.created_at = new Date()
    body.secret = utils.uid(40)
    body.user_id = req.user.id

    r.table(resource).insert(body, {returnChanges: true}).run().then(function(result) {
      callback(null, result)
    })
  }
}
