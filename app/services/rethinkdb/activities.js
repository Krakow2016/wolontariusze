'use strict'
var r = require('rethinkdb')

var env = process.env.NODE_ENV || 'development'
var configuration = require('../../../config.json')[env]
//var sendgrid_apikey = configuration.sendgrid_apikey
var dbConf = configuration.rethinkdb
var tableName = 'Activities'

var Activities = module.exports = {
  name: tableName,
  read: function(req, resource, params, config, callback) {
     // Połącz się z bazą danych `sdm`
    r.connect(dbConf, function(error, conn){
      if(error) { // Wystąpił błąd przy połączeniu z bazą danych
        callback(error)
        return
      }

      if(params.id) { // Pobierz krotkę o danym numerze id
        r.table(tableName)
          .get(params.id.toString())
          .merge(function(activity){
            return {
              created_by: r.db('sdm').table('Volunteers').get(activity('created_by')).pluck(['id', 'first_name', 'last_name', 'profile_picture_url'])
            }
          })
          .run(conn, function(err, activity){

            if(err) {
              return callback(err)
            } else if (!activity) {
              return callback(404)
            }

            r.table('Joints')
            .getAll(params.id, {index: 'activity_id'})
            .filter(function(x){
              return x.hasFields('is_canceled').not()
            }, {default: true})
            .eqJoin('user_id', r.table('Volunteers'))
            .map(
              function(doc){
                return doc.merge(function(){
                  return {'right': {'user_id': doc('right')('id')}}
                })
              })
            .pluck({'left': ['id'], 'right': ['user_id', 'first_name', 'last_name', 'profile_picture_url']})
            .zip()
            .run(conn, function(err, cursor){
              if (err) { return callback(500) }
              cursor.toArray(function(err, volunteers) {
                activity.volunteers = volunteers || []
                //console.log('ACTIVITY', activity)
                callback(null, activity)
              })
            })
          })
      } else {
        callback(400)
      }
    })
  },

  create: function(req, resource, params, body, config, callback) {
     // Połącz się z bazą danych `sdm`
    r.connect(dbConf, function(err, conn) {
      if(err) {
        callback(err)
        return
      }

      r.table(tableName).insert(body, {returnChanges: true}).run(conn, function (err, resp) {
        callback(err, resp)
      })
    })
  },

  update: function(req, resource, params, body, config, callback) {
    var id = body.id || params.id
    // Błąd gdy brak id
    if(!id) {
      callback(400)
      return
    }
    // Połącz się z bazą danych `sdm`
    r.connect(dbConf, function(err, conn) {
      if(err) {
        callback(err)
        return
      }

      // Wykonaj zapytanie do bazy danych
      r.table(tableName).get(id).update(body, {returnChanges: true}).run(conn, function (err, resp) {
        callback(err, resp)
      })
    })
  },

  delete: function(req, resource, params, config, callback) {
    // Połącz się z bazą danych `sdm`
    r.connect(dbConf, function(err, conn) {
      if(err) {
        callback(err)
        return
      }
      r.table(tableName).get(params.id).run(conn, function (err1, resp1) {
        if (err1) {
          callback(err1, resp1)
        }
        r.table(tableName).get(params.id).delete().run(conn, function (err2, resp2) {
          if(err2) {
            callback(err2)
            return
          }
          // Usuń wszystkie zgłoszenia do aktywności
          r.table('Joints')
            .getAll(params.id, {index: 'activity_id'})
            .delete()
            .run(conn, function(err3){
                // ok
              callback(err3, resp2)
            })
        })
      })
    })
  },

  join: function(req, resource, params, config, callback) {
    var body = {
      volunteers: r.row('volunteers').default([]).append(params.user_id).distinct()
    }
    Activities.update(req, resource, params, body, config, callback)
  },

  leave: function(req, resource, params, config, callback) {
    var body = {
      volunteers: r.row('volunteers').default([]).setDifference([params.user_id])
    }
    Activities.update(req, resource, params, body, config, callback)
  }
}
