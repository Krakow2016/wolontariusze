'use strict'
var r = require('rethinkdb')

var env = process.env.NODE_ENV || 'development'
var conf = require('../../../config.json')[env]

var Joints = module.exports = {
  name: 'ActivityTags',

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

      }

      config.returnChanges = true

      r.table('ActivityTags').insert(body, config).run(conn, function (err, resp) {
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

      config.returnChanges = true

      var ids = params.ids ? params.ids : [params.id]
      var table = r.table('ActivityTags')
      table.getAll.apply(table, ids).update(body, config).run(conn, callback)
    })
  }
}
