'use strict'

// The service code that you write is always executed on the server, but can be
// accessed transparently from actions without any knowledge of whether it's on
// the server or client. Fetchr provides an appropriate abstraction so that you
// can fetch (CRUD) the data needed in your stores using the same exact syntax
// on server and client side.
//
// Więcej: http://fluxible.io/guides/data-services.html


var activities = require('./activities.json')
var joints = require('./joints.json')
var volunteers = require('./volunteers.json')

var modifiedActivity = function (activityId, req, config) {
  if (activities[activityId]) {
    return activities[activityId]
  }
}

var getActivityVolunteers = function (activityId) {
  var vols = []
  for (var i in joints) {
    if (joints[i].activity_id == activityId && joints[i].is_canceled != true) {
      var vol = volunteers[joints[i].user_id]
      vols.push( {
        id: joints[i].id,
        user_id: vol.id,
        first_name: vol.first_name,
        last_name: vol.last_name
      })
    }
  }
  return vols
}

module.exports = {
  name: 'Activities',
  // at least one of the CRUD methods is required
  read: function(req, resource, params, config, callback) {
    if(params.id) {
      var activity = modifiedActivity(params.id, req, config)
      if(activity != null) {
        var vols = getActivityVolunteers(activity.id)
        activity.volunteers = vols || []
        callback(null, activity)
      } else {
        callback('404')
      }
    } else { // Brak identyfikatora, zwróć wszystkie aktywności

      var results = Object.keys(activities).map(function(key) {
        var act = modifiedActivity(key)
        act.volunteers = getActivityVolunteers(act.id)
        act.volunteerNumber = act.volunteers.length
        return act
      })
      var currentTime = new Date().getTime()
      if (params.type === 'openTasks') {
        results = results.filter(function (task) {
          var data = new Date(task.datetime).getTime()
          return ((typeof(task.is_archived) == 'undefined' || task.is_archived == false) &&
                   (typeof( task.datetime) == 'undefined' || (new Date(task.datetime).getTime()) > currentTime) &&
                   (parseInt(task.limit) == 0 || parseInt(task.limit) > task.volunteerNumber))
        })
      }
      if (params.type === 'volunteerTasks') {
        results = results.filter(function (task) {

          var isVolunteerTask = false
          for (var i in joints) {
            if (joints[i].activity_id == task.id && joints[i].user_id == (params.user_id+'')) {
              isVolunteerTask = true
              break
            }
          }

          return ((typeof( task.is_archived) == 'undefined' || task.is_archived == false) &&
                   (typeof( task.datetime) == 'undefined' || (new Date(task.datetime).getTime()) > currentTime) &&
                   isVolunteerTask)
        })
      }
      if (params.type === 'adminTasks') {

        results = results.filter(function (task) {
          return task.created_by == (params.user_id+'')
        })
      }

      if(results) {
        callback(null, results)
      } else {
        callback(404)
      }
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
    callback(null, {
      generated_keys: [id],
      changes: [
        { new_val: body }
      ]
    })
  },

  update: function(req, resource, params, body, config, callback) {
    var id = body.id || params.id
    delete activities[id]
    activities[id] = body //replace old activity
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
  }

}
