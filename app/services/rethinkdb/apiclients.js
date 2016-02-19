'use strict'

var r = require('rethinkdb')

var env = process.env.NODE_ENV || 'development'
var conf = require('../../../config.json')[env].rethinkdb

var utils = require('../../../oauth/utils')

module.exports = {

  name: 'APIClients',

  read: function(req, resource, params, config, callback) {
    r.connect(conf, function(error, conn){
      if(error) { // Wystąpił błąd przy połączeniu z bazą danych
        callback(error)
        return
      }

      if(params.id) { // Pobierz krotkę o danym numerze id
        r.table('APIClients').get(params.id).run(conn, function(err, row){
          if(err) {
            callback(err)
          } else if(!row) {
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
        .run(conn, function(err, cursor){

          if(err) { callback(err) }
          else { cursor.toArray(callback) }
        })
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

      body.created_at = new Date()
      body.secret = utils.uid(40)
      body.user_id = req.user.id

      r.table(resource).insert(body, {returnChanges: true}).run(conn, function(err, result) {
        if(err) { callback(err) }
        else {
          callback(null, result)
        }
      })
    })
  }
}
