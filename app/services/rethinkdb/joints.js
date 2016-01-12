'use strict'
var r = require('rethinkdb')

var env = process.env.NODE_ENV || 'development'
var conf = require('../../../config.json')[env]

var Joints = module.exports = {
  name: 'Joints',

  create: function(req, resource, params, body, config, callback) {

    if(!req.user) {
      return callback(403)
    }

     // Połącz się z bazą danych `sdm`
    r.connect(conf.rethinkdb, function(err, conn) {
      if(err) {
        callback(err)
        return
      }

      // Dopisz Id usera
      body.user_id = req.user.id

      r.table('Joints').insert(body, {returnChanges: true}).run(conn, function (err, resp) {
        callback(err, resp)
      })
    })
  },

  update: function(req, resource, params, body, config, callback) {
    // Połącz się z bazą danych `sdm`
    r.connect(conf.rethinkdb, function(err, conn) {
      if(err) {
        callback(err)
        return
      }

      var id = body.id

      r.table('Joints').get(id).update(body).run(conn, callback)
    })
  }
}
