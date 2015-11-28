// The service code that you write is always executed on the server, but can be
// accessed transparently from actions without any knowledge of whether it's on
// the server or client. Fetchr provides an appropriate abstraction so that you
// can fetch (CRUD) the data needed in your stores using the same exact syntax
// on server and client side.
//
// Więcej: http://fluxible.io/guides/data-services.html


var activities = require('./activities.json')
var volonteers = require('./volonteers.json')

var public_attrs = [
  'id',
  'title',
  'content',
  'creationTimestamp',
  'editionTimestamp',
  'startEventTimestamp',
  'duration',
  'place',
  'creatorId',
  'editorId',
  'maxVolonteers',
  'activeVolonteersIds',
]

var private_attrs = [
]

        
var getName = function (id) {
    if (volonteers[id]) {
        return volonteers[id].first_name+' '+volonteers[id].last_name;
    } else {
        return 'error';
    }
        
}

var modifiedActivity = function (activityId, req, config) {
    var activity = activities[activityId];
    if (activity != null) {

        var user = req.user || config.user
        // Flaga przywilejów administratora
        var is_admin = user && user.is_admin
        // Flaga właściciela profilu
        var is_owner = (user && (activity.creatorId == user.id));
        
        // Tablica parametrów uprawnionych do odczytu
        var attrs = public_attrs

        if(is_admin || is_owner) {
            attrs = attrs.concat(private_attrs)
        }
                
        //uzupełnij parametry o creatorName and editorName
        activity['creatorName'] =  getName(activity['creatorId']);
        activity['editorName']  = getName(activity['editorId']);
        
        //uzupełnij listę wolontariuszy
        if(activity['activeVolonteersIds']) {
            activity['activeVolonteers'] = activity['activeVolonteersIds'].map(function (id) {
                return {
                        "id": id,
                        "name": getName(id)
                }
            })
        }
        
        //uzupełnij limit wolontariuszy
        activity['volonteersLimit'] = 'Brak';
        if (activity['maxVolonteers'] > 0) {
            activity['volonteersLimit'] = activity['maxVolonteers'];
        }
        
        return activity;
    } else {
        return null;
    }
  
}


module.exports = {
    name: 'Activities',
    // at least one of the CRUD methods is required
    read: function(req, resource, params, config, callback) {
      if(params.id) {
        var activity = modifiedActivity(params.id, req, config);
        if(activity != null) {
            callback(null, activity);
        } else {
            callback("404")
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
        var ids = Object.keys(activities);
        var len = ids.length;
        var lastId = parseInt(ids[len-1]);
        var id;
        if (isNaN(lastId)) { //lista aktywności pusta
            id = 1;
        } else {
            id = lastId+1; //ostatnie id + 1
        }
        
        params.id = id+"";
        activities[id] = params;
        var activity = modifiedActivity(params.id, req, config);
        if(activity != null) {
            callback(null, activity);
        } else {
            callback("404")
        }  
        
    },
    
    update: function(req, resource, params, body, config, callback) {
        activities[params.id] = params;
        var activity = modifiedActivity(params.id, req, config);
        if(activity != null) {
            callback(null, activity);
        } else {
            callback("404")
        }  
    },

    delete: function(req, resource, params, config, callback) {
        delete activities[params.id];
        callback(null, activities);
    }

};
