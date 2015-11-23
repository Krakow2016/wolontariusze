// The service code that you write is always executed on the server, but can be
// accessed transparently from actions without any knowledge of whether it's on
// the server or client. Fetchr provides an appropriate abstraction so that you
// can fetch (CRUD) the data needed in your stores using the same exact syntax
// on server and client side.
//
// Więcej: http://fluxible.io/guides/data-services.html

var activities = {
    "1": {
        id: "1",
        title: "Pierwsza Aktywność",
        content: "Treść pierwszej aktywności",
        creationTimestamp: 120000,
        editionTimestamp: 120000,
        startEventTimestamp: 1200200,
        endEventTimestamp: 1500200,
        duration: "1h",
        attachments: ["1", "2", "3"],
        place: "Kraków",
        creatorId: "1",
        editorId: "1",
        points: 100,
        visibilityIds: ["1", "2"],
        maxVolonteers: 5,
        activeVolonteersIds: ["1","2"],
        isOpen: true,
        privateField: "Test1"
     },
    "2": {
        id: "2",
        title: "Druga Aktywność",
        content: "Treść drugiej aktywności",
        creationTimestamp: 220000,
        editionTimestamp: 1220000,
        startEventTimestamp: 2200200,
        endEventTimestamp: 25000200,
        duration: "2h",
        attachments: ["1", "2", "3"],
        place: "Dobczyce",
        creatorId: "2",
        editorId: "1",
        points: 100,
        visibilityIds: ["2"],
        maxVolonteers: 0,
        activeVolonteersIds: ["2"],
        isOpen: true,
        privateField: "Test2"
     },
    "3": {     
        id: "3",
        title: "Trzecia Aktywność",
        content: "Treść trzeciej aktywności",
        creationTimestamp: 320000,
        editionTimestamp: 1320000,
        startEventTimestamp: 3200200,
        endEventTimestamp: 3500200,
        duration: "1d",
        attachments: ["1", "2", "3"],
        place: "Myślenice",
        creatorId: "1",
        editorId: "2",
        points: 100,
        visibilityIds: ["1"],
        maxVolonteers: 10,
        activeVolonteersIds: [],
        isOpen: false,
        privateField: "Test3"
     },
}

var volonteers = require('./volonteers.json')

var public_attrs = [
  'id',
  'title',
  'content',
  'creationTimestamp',
  'editionTimestamp',
  'startEventTimestamp',
  'endEventTimestamp',
  'duration',
  'attachments',
  'place',
  'creatorId',
  'editorId',
  'points',
  'visibilityIds',
  'maxVolonteers',
  'activeVolonteersIds',
  'isOpen'
]

var private_attrs = [
    'privateField'
]

        
var getName = function (id) {
    if (volonteers[id]) {
        return volonteers[id].first_name+' '+volonteers[id].last_name;
    } else {
        return 'error';
    }
        
}

var modifiedActivity = function (activityId, req, config) {
    if (activityId) {
        var activity = activities[activityId];
        
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
        if(activity) {
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
        if(activity) {
            callback(null, activity);
        } else {
            callback("404")
        }  
        
    },
    
    update: function(req, resource, params, body, config, callback) {
        activities[params.id] = params;
        var activity = modifiedActivity(params.id, req, config);
        if(activity) {
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
