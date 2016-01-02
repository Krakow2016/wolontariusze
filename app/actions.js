'use strict'

var VolonteerStore = require('./stores/Volonteer')
var ActivityStore = require('./stores/Activity')
var navigateAction = require('fluxible-router').navigateAction;
var conf = require('../config.json')


var sendActivityEmailAction = function(context, query) {
    console.log("Send Activity Email", query);
    var request = new XMLHttpRequest()
    request.open('POST', '/activity_email', true)
    request.setRequestHeader('Content-Type', 'application/json')
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var resp = request.responseText;
        var json = JSON.parse(resp)

        console.log(json) // TODO: wyświetl wyniki

        context.dispatch('ACTIVITY_EMAIL_SEND', json)
      } else {
        // We reached our target server, but it returned an error
      }
    }

    request.onerror = function() {
      // There was a connection error of some sort
    }

    request.send(JSON.stringify(query))
  }

module.exports = {
  showVolonteer: function(context, payload, cb) {
    // Pobierz dane wolontariusza z bazy danych
    context.service.read('Volonteers', payload, {},
      function (err, data) {
        if (err) { console.log(err) }
        else { context.dispatch('LOAD_VOLONTEER', data) }
        cb()
      }
    )
  },

  loadVolonteers: function(context, payload, cb) {
    // Pobierz dane wolontariusza z bazy danych
    context.service.read('Volonteers', payload, {},
      function (err, data) {
        if(err) { console.log(err) }
        else { context.dispatch('LOAD_VOLONTEERS', data) }
        cb()
      }
    )
  },

  createVolonteer: function(context, payload, cb) {
    var volonteerStore = context.getStore(VolonteerStore)
    var volonteer = volonteerStore.createVolonteer(payload)

    context.service.create('Volonteers', {}, volonteer, function (err) {
      if (err) { // Błąd po stronie serwera
        context.dispatch('VOLONTEER_CREATION_FAILURE', [volonteer])
      } else {
        context.dispatch('VOLONTEER_CREATION_SUCCESS', [volonteer])
      }
      cb()
    })
  },

  updateVolonteer: function(context, payload, cb) {
    var volonteerStore = context.getStore(VolonteerStore)
    var volonteer = volonteerStore.createVolonteer(payload)

    context.service.update('Volonteers', {}, volonteer, function (err) {
      if (err) { // Błąd po stronie serwera
        context.dispatch('VOLONTEER_UPDATE_FAILURE', [volonteer])
      } else {
        context.dispatch('VOLONTEER_UPDATE_SUCCESS', [volonteer])
      }
      cb()
    })
  },

  showActivity: function(context, payload, cb) {
      console.log('show activity');
    // Pobierz dane aktywności z bazy danych
    context.service.read('Activities', payload, {
      store: 'Activity',
    }, function (err, data) {
      if(err) { console.log(err) }
      else { context.dispatch('LOAD_ACTIVITY', data) }
      cb()
    })
  },
  loadActivities: function(context, payload, cb) {
    // Pobierz dane wolontariusza z bazy danych
    context.service.read('Activities', payload, {
      // Przekaż obiekt zalogowanego użytkownia niezbędy do podjęcia
      // decyzji o tym jakie dane mają być zwrócone.
      user: context.getUser()
    }, function (err, data) {
      if(err) { console.log(err) }
      else { context.dispatch('LOAD_ACTIVITIES', data) }
      cb()
    })
  },
  updateActivity: function(context, payload, cb) {
    console.log('update activity');
    context.service.update('Activities', payload, {}, function (err, data) {
        if(err) { console.log(err) }
        else { context.dispatch('ACTIVITY_UPDATED', data) }
        cb()  
    })
  },
  createActivity: function(context, payload, cb) {
      
    var activityData = payload.data;
    var query = payload.query;
    
    console.log('create activity');
    
    context.service.create('Activities', activityData, {}, function (err, data) {
        if(err) { console.log(err) }
        else { 
            console.log("ACTIVITY DATA", data);
            var id;
            if(conf.service === 'rethinkdb') {
              id = data.generated_keys[0];
            } else {
              id = data.id;
            }
            //context.dispatch('ACTIVITY_CREATED', {});
                
            context.executeAction(navigateAction, {url: "/aktywnosc/"+id});
            
            query.text = "Jeśli otrzymujesz tego maila, możesz być dopisany do tej aktywności. Aktualna lista wolontariuszy, którzy"+
                  " biorą udział znajduje się na stronie http:localhost:7000/aktywnosc/"+id+" .\n"
            context.executeAction(sendActivityEmailAction, query);

        }
        cb()  
    })
  },
  deleteActivity: function(context, payload, cb) {
    console.log('delete activity');
    context.service.delete('Activities', payload, {
      user: context.getUser()}, function (err, data) {
        if(err) { console.log(err) }
        else { 
            context.dispatch('ACTIVITY_DELETED', data);
            context.executeAction(navigateAction, {url: "/"});
        }
        cb()  
    })
  },

  showComments: function(context, payload, cb) {
    console.log('profile comment read')
    context.service.read('Comments', payload, {}, function (err, data) {
      context.dispatch('LOAD_COMMENTS', data);
      cb()
    })
  },

  createComment: function(context, payload, cb) {
    console.log('profile comment create')
    context.service.create('Comments', payload, {}, function (err, data) {
      if(err) { console.log(err) }
      else { context.dispatch('COMMENT_CREATED', data) }
      cb()
    })
  },

  profileCommentsUpdate: function(context, payload, cb) {
    console.log('profile comment update')
    context.service.update('Comments', payload, {}, function (err, data) {
      if(err) { console.log(err) }
      else { context.dispatch('COMMENT_UPDATED', payload) }
      cb()
    })
  },

  profileCommentsDelete: function(context, payload, cb) {
    console.log('profile comment delete')
    context.service.delete('Comments', payload, {}, function (err, data) {
      if(err) { console.log(err) }
      else { context.dispatch('COMMENT_DELETED', payload) }
      cb()
    })
  },

  showIntegrations: function(context, payload, cb) {
    // Pobierz dane wolontariusza z bazy danych
    context.service.read('Integrations', payload, {},
      function (err, data) {
        if (err) { console.log(err) }
        else { context.dispatch('LOAD_INTEGRATIONS', data) }
        cb()
      }
    )
  },

  showResults: function(context, state, cb) {

    var age_from = parseInt(state['age-from'])
    var age_to = parseInt(state['age-to'])

    var languages

    var filtered = {
      filtered : {
        query: {
          bool: {
            should: [
              { bool: {
              should: [
                { match: { "doc.first_name": state.name } },
                { match: { "doc.last_name": state.name } },
              ]
            }},
            { match: { "doc.email": state.email } },
            { match: { "doc.address": state.address } },
            { match: { "doc.address2": state.address } },
            { match: { "doc.parish": state.parish } },
            { match: { "doc.education": state.education } },
            { match: { "doc.study_field": state.studies } },
            { match: { "doc.departments": state.departments } },
            { match: { "doc.comments": state.comments } },
            { bool: {
              should: [
                { match: { "doc.interests": state.interests } },
                { match: { "doc.experience": state.interests } }
              ]
            }}
            ],
            must: []
          },
        },
        filter : { },
      }
    }

    var query = {
      size: 100,
      query : {
        function_score: {
          query : {
            nested: {
              path: "doc",
              query : filtered
            }
          },
          functions: [],
          score_mode: "avg"
        }
      },
      //explain: true,
      highlight : {
        fields : {
          experience: {},
          interests: {},
          departments: {},
          comments: {}
        }
      }
    }

    // Jęzkyki
    var language = state.language
    var language_keys = language ? Object.keys(language) : []
    language_keys.forEach(function(key){
      if(language[key]) {
        var range = {}
        range['languages.'+key+'.level'] = { gte: 1, lte: 10 }
        filtered.query.bool.must.push({range: range})
        query.query.function_score.functions.push({
          field_value_factor: {
            "field" : "languages."+key+".level",
            "modifier" : "square"
          }
        })
      }
    })

    if(state['other_val']) {
      var val = state['other_val']
      var range = {}
      range['languages.'+val+'.level'] = { gte: 1, lte: 10 }
      filtered.query.bool.must.push({range: range})
      query.query.function_score.functions.push({
        field_value_factor: {
          "field" : "languages."+val+".level",
          "modifier" : "square"
        }
      })
    }

    // Uczestnictwo w poprzednich Światowych Dniach Młodzieży
    var wyds = state.wyd
    var wyds_keys = wyds ? Object.keys(wyds) : []
    if(wyds_keys.length) {
      filtered.filter.and = []
      wyds_keys.forEach(function(key){
        if(wyds[key]) {
          filtered.filter.and.push({
            exists: { field: 'previous_wyd.'+key }
          })
        }
      })
    }

    if(age_from || age_to) {
      var today = new Date()
      var range = {
        range: {
          birth_date: {} }}

          if(age_from)
            range.range.birth_date.lte = new Date(new Date().setMonth(today.getMonth() - 12*(age_from-1)))
          if(age_to)
            range.range.birth_date.gte = new Date(new Date().setMonth(today.getMonth() - 12*age_to))

          if(filtered.filter.and) {
            filtered.filter.and.push(range)
          } else {
            filtered.filter.and = [range]
          }
    }

    var request = new XMLHttpRequest()
    request.open('POST', '/search', true)
    request.setRequestHeader('Content-Type', 'application/json')
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var resp = request.responseText;
        var json = JSON.parse(resp)

        console.log(json) // TODO: wyświetl wyniki

        context.dispatch('LOAD_RESULTS', json)
      } else {
        // We reached our target server, but it returned an error
      }
    }

    request.onerror = function() {
      // There was a connection error of some sort
    }

    request.send(JSON.stringify(query))

    // Usuń parametry
    var base = window.location.toString().replace(new RegExp("[?](.*)$"), '')
    var attributes = Object.keys(state).map(function(key) {
        return key + '=' + state[key];
    }).join('&')
    history.replaceState({}, "", base +'?'+ attributes)
  },

  inviteUser: function(context, user) {
    var query = {id: user.id}
    var request = new XMLHttpRequest()
    request.open('POST', '/invitation', true)
    request.setRequestHeader('Content-Type', 'application/json')
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var resp = request.responseText;
        var json = JSON.parse(resp)

        console.log(json) // TODO: wyświetl wyniki

        context.dispatch('INVITATION_SEND', json)
      } else {
        // We reached our target server, but it returned an error
      }
    }

    request.onerror = function() {
      // There was a connection error of some sort
    }

    request.send(JSON.stringify(query))
  },
  
  sendActivityEmail: sendActivityEmailAction
}
