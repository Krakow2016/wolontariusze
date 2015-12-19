var r = require('rethinkdb')
var conf = require('../../../config.json').rethinkdb

var getName = function (id, volData) {
    var result
    if (id)
    for (var i = 0 ; i<volData.length; i++) {
      if (volData[i].id == id) {
        result = volData[i].name;
        break;
      }
    }
    return result;
}


var modifiedActivity = function (activity, volData, req, config) {
    if (activity != null) {
        var user = req.user || config.user
        // Flaga przywilejów administratora
        var is_admin = user && user.is_admin
        // Flaga właściciela profilu
        var is_owner = (user && (activity.creatorId == user.id));
        
        //uzupełnij parametry o creatorName and editorName
        activity['creatorName'] =  getName(activity['creatorId'], volData);
        activity['editorName']  = getName(activity['editorId'], volData);
        
        //uzupełnij listę wolontariuszy
        if(activity['activeVolonteersIds']) {
            activity['activeVolonteers'] = activity['activeVolonteersIds'].map(function (id) {
                return {
                        "id": id,
                        "name": getName(id, volData)
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

var getVolonteersIds = function (activity) {
  var ids = [];
  var creatorId = (activity.creatorId == null) ? '' : activity.creatorId  ;
  var editorId = (activity.editorId == null) ? '' : activity.editorId  ;
  var activeVolonteersIds = activity.activeVolonteersIds;
  if (creatorId != '') {
    ids.push(creatorId);
  }
  if (editorId != '' && editorId != creatorId) {
    ids.push(editorId);
  }
  for (var i = 0; i < activeVolonteersIds.length; i++) {
    var volId = (activeVolonteersIds[i] == null) ? '' : activeVolonteersIds[i]   ;
    if (volId != '' && volId != creatorId && volId != editorId) {
      ids.push(volId);
    }
  }
  return ids;
}

module.exports = {
  name: 'Activities',
  read: function(req, resource, params, config, callback) {
     // Połącz się z bazą danych `sdm`
    r.connect(conf, function(error, conn){
      if(error) { // Wystąpił błąd przy połączeniu z bazą danych
        callback(error)
        return
      }

      if(params.id) { // Pobierz krotkę o danym numerze id
        r.table('Activities').get(params.id).run(conn, function(err, row){
          if (err) { 
            console.log(err);
            callback(err)
            
          } else {
            if (row && getVolonteersIds(row).length > 0) {
              var volIds = getVolonteersIds(row);
              r.table('Volonteers').getAll(r.args(volIds)).coerceTo('array')
              .run(conn, function (error, volonteers) {
                if (error) {callback(error)} 
                else {
                  var volData = volonteers.map(function (vol) {
                    return {
                      id: vol.id,
                      name: vol.first_name+" "+vol.last_name
                    }
                  })
                  var modAct = modifiedActivity(row, volData, req, config);
                  console.log("MODIFIED ACTIVITY ", modAct);
                  callback(error || !modAct, modAct);
                }
              });
            } else {
              callback (error || !row, row);
            }
          }
        }); 
      } else { // Pobierz listę krotek
        if(config.index) { // use index
          r.table('Activities').getAll(params.key, {index: config.index}).run(conn, function(err, cursor) {
            if(err) { callback(err) }
            else { cursor.toArray(callback) }
          })
        } else { // Brak identyfikatora
          // Zwróć wszyskich wolontariuszy
          r.table('Activities').limit(50).run(conn, function(err, cursor) {
            if(err) { callback(err) }
            else { cursor.toArray(callback) }
          })
        }
      }
    })
  },

  create: function(req, resource, params, body, config, callback) {
     // Połącz się z bazą danych `sdm`
    r.connect(conf, function(err, conn) {
      if(err) {
        callback(err)
        return
      }

      r.table(resource).insert(params).run(conn, callback) 
      
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
    r.connect(conf, function(err, conn) {
      if(err) {
        callback(err)
        return
      }

      // Wykonaj zapytanie do bazy danych
      r.table(resource).get(id).update(params).run(conn, callback)
    })
  },
  
  delete: function(req, resource, params, config, callback) {
    // Połącz się z bazą danych `sdm`
    r.connect(conf, function(err, conn) {
      if(err) {
        callback(err)
        return
      }

      r.table(resource).get(params.id).delete().run(conn, callback)
    })
  }
}
