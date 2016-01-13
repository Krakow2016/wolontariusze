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

      // Tworzymy wiele obiektów
      if(body.length) {
        // Opcja tylko dla adminów
        if(!req.user.is_admin) { return callback(403) }
      } else {
        // Dopisz Id usera jeżeli pole jest puste
        if(!body.user_id) {
          body.user_id = req.user.id
        }
      }

      r.table('Joints').insert(body, config).run(conn, function (err, resp) {
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
