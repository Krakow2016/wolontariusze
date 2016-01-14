'use strict'

// The service code that you write is always executed on the server, but can be
// accessed transparently from actions without any knowledge of whether it's on
// the server or client. Fetchr provides an appropriate abstraction so that you
// can fetch (CRUD) the data needed in your stores using the same exact syntax
// on server and client side.
//
// Więcej: http://fluxible.io/guides/data-services.html


var activities = require('./activities.json')

var public_attrs = [
  'id',
  'title',
  'content',
  'creationTimestamp',
  'editionTimestamp',
  'startEventTimestamp',
  'duration',
  'place',
  'creator',
  'editor',
  'maxVolunteers',
  'volunteers'
]

var private_attrs = [
]


var modifiedActivity = function (activityId, req, config) {
  var activity = activities[activityId]
  if (activity != null) {

    var user = req.user || config.user
    // Flaga przywilejów administratora
    var is_admin = user && user.is_admin
    // Flaga właściciela profilu
    var is_owner = (user && (activity.creator == user.id))
    
    // Tablica parametrów uprawnionych do odczytu
    var attrs = public_attrs

    if(is_admin || is_owner) {
      attrs = attrs.concat(private_attrs)
    }
    
    return activity
  } else {
    return null
  }
  
}


module.exports = {
  name: 'Activities',
  // at least one of the CRUD methods is required
  read: function(req, resource, params, config, callback) {
    if(params.id) {
      var activity = modifiedActivity(params.id, req, config)
      if(activity != null) {
        callback(null, activity)
      } else {
        callback('404')
      }
    } else { // Brak identyfikatora, zwróć wszystkie aktywności
      var results = Object.keys(activities).map(function(key) {
        return activities[key]
      })
      callback(null, results)
      return
    }
  },
  
  create: function(req, resource, params, body, config, callback) {
    var ids = Object.keys(activities)
    var len = ids.length
    var lastId = parseInt(ids[len-1])
    var id
    if (isNaN(lastId)) { //lista aktywności pusta
      id = 1
    } else {
      id = lastId+1 //ostatnie id + 1
    }
    
    body.id = id+''
    activities[id] = body
    var activity = modifiedActivity(body.id, req, config)
    if(activity != null) {
      callback(null, activity)
    } else {
      callback('404')
    }  
      
  },
  
  update: function(req, resource, params, body, config, callback) {
    var id = body.id || params.id
    for (var key in body) {
      activities[id][key] = body[key]
    }
    var activity = modifiedActivity(id, req, config)
    if(activity != null) {
      var resp = { changes: [{new_val: activity}]}
      callback(null, resp)
    } else {
      callback('404')
    }  
  },

  delete: function(req, resource, params, config, callback) {
    delete activities[params.id]
    callback(null, activities)
  },
  
  join: function(req, resource, params, config, callback) {
    var volunteers = activities[params.id].volunteers
    volunteers.push(params.user_id)
    var body = {
      volunteers: volunteers
    }
    this.update(req, resource, params, body, config, callback)
  },

  leave: function(req, resource, params, config, callback) {
    var volunteers = activities[params.id].volunteers
    var index = volunteers.indexOf(params.user_id)
    if(index > -1) { volunteers.splice(index, 1) }
    var body = {
      volunteers: volunteers
    }
    this.update(req, resource, params, body, config, callback)
  }

}
