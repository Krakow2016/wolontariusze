'use strict'
var env = process.env.NODE_ENV || 'development'
var configuration = require('../../../config.json')[env]
//var sendgrid_apikey = configuration.sendgrid_apikey
var dbConf = configuration.rethinkdb
var tableName = 'Pilgrims'

// Konfiguracja bazy danych
var r = require('rethinkdbdash')({
  servers: [ dbConf ]
})

var Activities = module.exports = {
  name: tableName,
  read: function(req, resource, params, config, callback) {
    if(params.key) {
      r.table(tableName).getAll(params.key, {index: 'created_at'}).run().then(function(result) {
        callback(null, result)
      })
    } else {
      r.table(tableName).orderBy({index: r.desc('created_at')}).limit(1).run().then(function(result) {
        callback(null, result)
      })
    }
  }
}
