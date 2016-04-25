'use strict'
var r = require('rethinkdb')

var env = process.env.NODE_ENV || 'development'
var configuration = require('../../../config.json')[env]
//var sendgrid_apikey = configuration.sendgrid_apikey
var dbConf = configuration.rethinkdb
var tableName = 'Pilgrims'

var Activities = module.exports = {
  name: tableName,
  read: function(req, resource, params, config, callback) {
     // Połącz się z bazą danych `sdm`
    r.connect(dbConf, function(error, conn){
      if(error) { // Wystąpił błąd przy połączeniu z bazą danych
        callback(error)
        return
      }

      if(params.key) {
        r.table(tableName).getAll(params.key, {index: 'created_at'}).run(conn, function(err, cursor) {
          if(err) { callback(err) }
          else { cursor.toArray(callback) }
        })
      } else {
        r.table(tableName).orderBy({index: r.desc('created_at')}).limit(1).run(conn, function(err, cursor) {
          if(err) { callback(err) }
          else { cursor.toArray(callback) }
        })
      }
    })
  }
}
