'use strict'
var r = require('rethinkdb')
var crypto = require('crypto')

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

        body.forEach(function(joint) {
          // Upewnij się że user_id i activity są unikalne
          var hash = crypto.createHash('sha256')
          hash.update(joint.user_id + joint.activity_id)
          joint.id = hash.digest('hex')
        })
      } else {
        // Dopisz Id usera jeżeli pole jest puste
        if(!body.user_id) {
          body.user_id = req.user.id
        }
        // Upewnij się że user_id i activity są unikalne
        var hash = crypto.createHash('sha256')
        hash.update(body.user_id + body.activity_id)
        body.id = hash.digest('hex')
      }

      // W przypadku kiedy wypisaliśmy się i ponownie sie zapisujemy
      config.conflict = 'replace'
      config.returnChanges = true

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

      config.returnChanges = true

      var ids = params.ids ? params.ids : [params.id]
      var table = r.table('Joints')
      table.getAll.apply(table, ids).update(body, config).run(conn, callback)
    })
  }
}
