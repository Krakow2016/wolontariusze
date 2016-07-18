'use strict'
var env = process.env.NODE_ENV || 'development'
var configuration = require('../../../config.json')[env]
//var sendgrid_apikey = configuration.sendgrid_apikey
var dbConf = configuration.rethinkdb
var tableName = 'Activities'

// Konfiguracja bazy danych
var r = require('rethinkdbdash')({
  servers: [ dbConf ]
})

var Activities = module.exports = {
  name: tableName,
  read: function(req, resource, params, config, callback) {
    if(params.id) { // Pobierz krotkę o danym numerze id
      r.table(tableName)
        .get(params.id.toString())
        .merge(function(activity){
          return {
            created_by: r.db('sdm').table('Volunteers').get(activity('created_by')).pluck(['id', 'first_name', 'last_name', 'profile_picture_url', 'responsibilities'])
          }
        })
        .run().then(function(activity){

          if (!activity) {
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
          .pluck({'left': ['id', 'created_at'], 'right': ['user_id', 'first_name', 'last_name', 'profile_picture_url', 'thumb_picture_url']})
          .zip()
          .orderBy(r.row('created_at'))
          .run().then(function(volunteers){
            activity.volunteers = volunteers || []
            //console.log('ACTIVITY', activity)
            callback(null, activity)
          })
        })
    } else {
      callback(400)
    }
  },

  create: function(req, resource, params, body, config, callback) {
    r.table(tableName).insert(body, {returnChanges: true}).run().then(function (resp) {
      callback(null, resp)
    })
  },

  update: function(req, resource, params, body, config, callback) {
    var id = body.id || params.id
    // Błąd gdy brak id
    if(!id) {
      callback(400)
      return
    }
    // Wykonaj zapytanie do bazy danych
    r.table(tableName).get(id).update(body, {returnChanges: true}).run().then(function (resp) {
      callback(null, resp)
    })
  },

  delete: function(req, resource, params, config, callback) {
    r.table(tableName).get(params.id).run().then(function (resp1) {
      r.table(tableName).get(params.id).delete().run().then(function (resp2) {
        // Usuń wszystkie zgłoszenia do aktywności
        r.table('Joints')
          .getAll(params.id, {index: 'activity_id'})
          .delete()
          .run().then(function(){
              // ok
            callback(null, resp2)
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
