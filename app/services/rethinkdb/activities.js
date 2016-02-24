'use strict'
var r = require('rethinkdb')

var env = process.env.NODE_ENV || 'development'
var configuration = require('../../../config.json')[env]
//var sendgrid_apikey = configuration.sendgrid_apikey
var dbConf = configuration.rethinkdb
var tableName = 'Activities'

//var getVolonteer = function (id, volData) {
  //var result = {id: '', name: '', email: ''}
  //if (id) {
    //for (var i = 0 ; i<volData.length; i++) {
      //if (volData[i].id == id) {
        //result = volData[i]
        //break
      //}
    //}
  //}
  //return result
//}


//var modifiedActivity = function (activity, volData) {
  //if (activity != null) {
    ////uzupełnij twórcę i ostatniego edytora o aktualne dane
    //var creatorId = (activity.creator) ? activity.creator.id : null
    //var editorId = (activity.editor) ? activity.editor.id : null
    //activity['creator'] =  getVolonteer(creatorId, volData)
    //activity['editor']  = getVolonteer(editorId, volData)

    ////uzupełnij listę wolontariuszy o aktualne dane
    //activity['activeVolonteers'] = activity['activeVolonteers'].map(function (vol) {
      //return getVolonteer(vol.id, volData)
    //})
    ////usun pustych wolontariuszy
    //activity['activeVolonteers'] = activity['activeVolonteers'].filter (function (vol) {
      //return (vol.id != '')
    //})

    ////uzupełnij limit wolontariuszy
    //activity['volonteersLimit'] = 'Brak'
    //if (activity['maxVolonteers'] > 0) {
      //activity['volonteersLimit'] = activity['maxVolonteers']
    //}
    //return activity
  //} else {
    //return null
  //}
//}

//var getVolonteersIds = function (activity) {
  //var ids = []
  //var creatorId = (activity.creator == null) ? '' : activity.creator.id
  //var editorId = (activity.editor == null) ? '' : activity.editor.id
  //var activeVolonteersIds = activity.activeVolonteers.map (function (vol) {
    //return vol.id
  //})
  //if (creatorId != '') {
    //ids.push(creatorId)
  //}
  //if (editorId != '' && editorId != creatorId) {
    //ids.push(editorId)
  //}
  //for (var i = 0; i < activeVolonteersIds.length; i++) {
    //var volId = (activeVolonteersIds[i] == null) ? '' : activeVolonteersIds[i]
    //if (volId != '' && volId != creatorId && volId != editorId) {
      //ids.push(volId)
    //}
  //}
  //return ids
//}


//var addEmail = function (emails, newEmail) {
  //if (newEmail) {
    //for (var i = 0; i < emails.length; i++) {
      //if (newEmail == emails[i]) {
        //return
      //}
    //}
    //emails.push(newEmail)
  //}
//}

//zwraca adresy mailowe wolontariuszy, którzy biorą lub brali udział, twórcy aktywności oraz tego, kto ostatnio edytował
//var getUsersEmails = function (oldActivity, newActivity) {
    //var emails = []
    //addEmail(emails, (oldActivity.creator) ? oldActivity.creator.email : null)
    //addEmail(emails, (oldActivity.editor) ? oldActivity.editor.email : null)

    //var oldVolonteers = oldActivity.activeVolonteers
    //for (var i = 0; i < oldVolonteers.length; i++) {
      //addEmail(emails, oldVolonteers[i].email)
    //}

    //if (newActivity != null) {
      //addEmail(emails, (newActivity.editor) ? newActivity.editor.email : null)

      //var newVolonteers = newActivity.activeVolonteers
      //for (var i = 0; i < newVolonteers.length; i++) {
        //addEmail(emails, newVolonteers[i].email)
      //}
    //}
    //return emails
//}

//var getChangeList = function (oldState, newState) {
    //var changes =""
    //if (oldState.title != newState.title) {
        //changes += "Tytuł \n"
    //}
    //if (oldState.startEventTimestamp != newState.startEventTimestamp) {
        //changes += "Czas rozpoczęcia \n"
    //}
    //if (oldState.duration != newState.duration) {
        //changes += "Czas trwania \n"
    //}
    //if (oldState.place != newState.place) {
        //changes += "Miejsce wydarzenia \n"
    //}
    //if (oldState.is_urgent != newState.is_urgent) {
        //changes += "Priorytet \n"
    //}
    //if (oldState.content != newState.content) {
        //changes += "Treść aktywności \n"
    //}
    //if (oldState.title != newState.title) {
        //changes += "Tytuł \n"
    //}
    //if (oldState.activeVolonteers.length != newState.activeVolonteers.length) {
        //changes += "Lista wolontariuszy \n"
    //} else {
      //for (var i = 0; i < newState.activeVolonteers.length; i++) {
        //if (oldState.activeVolonteers[i].id != newState.activeVolonteers[i].id) {
          //changes += "Lista wolontariuszy \n"
          //break
        //}
      //}
    //}
    //if (oldState.maxVolonteers != newState.maxVolonteers) {
      //changes += "Limit wolontariuszy \n"
    //}
    //return changes
//}

// Połączenie z sendgrid daje nam możliwość wysyłania emaili
//var sendgrid = require('sendgrid')(sendgrid_apikey)

//var sendActivityEmail = function (data, user) {
  ////console.log("EMAIL", data)
  //if(user && user.is_admin) {
    //var email = new sendgrid.Email({
      //to:       data.to,
      //from:     'wolontariat@krakow2016.com',
      //subject:  data.subject,
      //text:     data.text
    //})
    //sendgrid.send(email, function(err, json) {
      ////console.log('sendgrid:', err, json)
    //})
  //}
//}

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
        r.table(tableName).get(params.id)
        .merge(function (activity) { //To służy do tego, żeby usunąć kategorie, które są cancelowane
          return {
            tags: r.table('ActivityTags')
                  .getAll(r.args(r.branch(activity.hasFields('tags').and(activity('tags').count().gt(0)), activity('tags').map(function (tag) { return tag('id')}).coerceTo('array'), [-1, -2])))
                  .filter(function (x) {
                    return x.hasFields('is_canceled').not()
                  }, {default: true})
                  .coerceTo('array')
          }
        })
        .run(conn, function(err, activity){

          if(err || !activity) {
            return callback(err || 404)
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
            .pluck({'left': ['id'], 'right': ['user_id', 'first_name', 'last_name']})
            .zip()
            .run(conn, function(err, cursor){
              if (err) { 
                //console.log(err) 
              }
              cursor.toArray(function(err, volunteers) {
                activity.volunteers = volunteers || []
                //console.log('ACTIVITY', activity)
                callback(null, activity)
              })
            })
        })
      } else {
        
        if (params.type) 
        {
          //http://www.w3schools.com/jsref/jsref_gettime.asp
          var currentTime = new Date().getTime()
          if (params.type === 'openTasks') {
            r.table(tableName)
            .filter (function (task) {
              return task.hasFields('is_archived').not().or(
                            task('is_archived').eq(false))
            }, {default: true})
            .filter (function (task) {
              return task.hasFields('datetime').not().or(
                            r.ISO8601(task('datetime')).toEpochTime().gt(currentTime))  
            }, {default: true})
           .merge (function (task) {
             return {
               tags: r.table('ActivityTags') //To służy do usunięcia zcancelowanych kategorii
                      .getAll(r.args(r.branch(task.hasFields('tags').and(task('tags').count().gt(0)), task('tags').map(function (tag) { return tag('id')}).coerceTo('array'), [-1, -2])))
                      .filter(function (x) {
                        return x.hasFields('is_canceled').not()
                      }, {default: true})
                      .coerceTo('array'),
               volunteerNumber: r.table('Joints')
                  .getAll(task('id'), {index: 'activity_id'})
                  .filter(function (x) {
                    return x.hasFields('is_canceled').not()
                  }, {default: true})
                  .count()
             }
           })
           .filter( function (task) {
             return task('maxVolunteers').coerceTo('number').eq(0).or(
                task('maxVolunteers').coerceTo('number').gt(task('volunteerNumber')))
           }, {default: true})
            .run(conn, function(err, cursor) {
              if(err) { callback(err) }
              else { 
                cursor.toArray(callback) 
              }
            })
          }
          
          if (params.type === 'volunteerTasks') {
            r.table(tableName)
            .filter (function (task) {
              return task.hasFields('is_archived').not().or(
                            task('is_archived').eq(false))
            }, {default: true})
            .filter (function (task) {
              return task.hasFields('datetime').not().or(
                            r.ISO8601(task('datetime')).toEpochTime().gt(currentTime))
            }, {default: true})
            .merge (function (task) {
              return {     
                tags: r.table('ActivityTags') //To służy do usunięcia zcancelowanych kategorii
                      .getAll(r.args(r.branch(task.hasFields('tags').and(task('tags').count().gt(0)), task('tags').map(function (tag) { return tag('id')}).coerceTo('array'), [-1, -2])))
                      .filter(function (x) {
                        return x.hasFields('is_canceled').not()
                      }, {default: true})
                      .coerceTo('array'),
                volunteerNumber: r.table('Joints')
                    .getAll(task('id'), {index: 'activity_id'})
                    .filter(function (x) {
                      return x.hasFields('is_canceled').not()
                    }, {default: true})
                    .count()
              }
            })
            .filter( function (task) {
              return r.table('Joints').getAll(task('id'), {index: 'activity_id'})
                      .contains(function (x) {
                        return x.hasFields('is_canceled').not().and(
                          x('user_id').coerceTo('string').eq(params.user_id+'')
                        )
                      })
            }, {default: true})
            .run(conn, function(err, cursor) {
              if(err) { callback(err) }
              else { 
                cursor.toArray(callback)
              }
            })
          }
          
          if (params.type === 'adminTasks') {
            r.table(tableName)
            .filter( function (task) {
              return task('creator').coerceTo('string').eq(params.user_id+'')
            }, {default: true})
            .merge (function (task) {
              return {
                tags: r.table('ActivityTags') //To służy do usunięcia zcancelowanych kategorii
                      .getAll(r.args(r.branch(task.hasFields('tags').and(task('tags').count().gt(0)), task('tags').map(function (tag) { return tag('id')}).coerceTo('array'), [-1, -2])))
                      .filter(function (x) {
                        return x.hasFields('is_canceled').not()
                      }, {default: true})
                      .coerceTo('array'),
                volunteerNumber: r.table('Joints')
                    .getAll(task('id'), {index: 'activity_id'})
                    .filter(function (x) {
                      return x.hasFields('is_canceled').not()
                    }, {default: true})
                    .count()
              }
            })
            .run(conn, function(err, cursor) {
              if(err) { callback(err) }
              else { 
                cursor.toArray(callback) 
              }
            })
          }

        } else {
          r.table(tableName).limit(50).run(conn, function(err, cursor) {
            if(err) { callback(err) }
            else { cursor.toArray(callback) }
          })
        }

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
          //if (!err) {
            //var user = req.user || config.user
            //var id = resp.generated_keys[0];
            //var data = {
              //to: getUsersEmails(params, null),
              //subject: "Została UTWORZONA aktywność: "+params.title,
              //text: "Jeśli otrzymujesz tego maila, możesz być dopisany do tej aktywności. Aktualna lista wolontariuszy, którzy"+
                  //" biorą udział znajduje się na stronie http:localhost:7000/aktywnosc/"+id+" .\n"
            //}
            //sendActivityEmail(data, user);
          //}
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
      // https://www.rethinkdb.com/api/python/replace/ -- replace dlatego, bo obiekt może posiadać a nie musi niektóre pola.
      // Np. jeśli obiekt nie posiada współrzędnych geograficznych, to nie powinna wyświetlać się mapa.
      // Używając update nie można by usunąć istnięjących pól
      r.table(tableName).get(id).replace(body, {returnChanges: true}).run(conn, function (err, resp) {
          //if (!err1 && !err2 && params.updateEmail) {
            //var user = req.user || config.user
            //var data = {
              //to: getUsersEmails(resp1, params),
              //subject: "Została ZMIENIONA aktywnośc: "+params.title,
              //text: "Jeśli otrzymujesz tego maila, możesz być dopisany do tej aktywności. Aktualna lista wolontariuszy, którzy"+
              //" biorą udział znajduje się na stronie http:localhost:7000/aktywnosc/"+params.id+" .\n"+
              //"Zmienione zostało: \n"+getChangeList(resp1,params)
            //}
            //sendActivityEmail(data, user);
          //}
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
          //if (!err1 && !err2) {
            //var user = req.user || config.user
            //var data = {
              //to: getUsersEmails(resp1, null),
              //subject: "Została USUNIĘTA aktywność: "+resp1.title,
              //text: "Jeśli otrzymujesz tego maila, mogłeś być dopisany do tej aktywności. "
            //}
            //sendActivityEmail(data, user);
          //}
          callback(err2, resp2)
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
