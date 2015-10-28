'use strict'

var VolonteerStore = require('./stores/Volonteer')
var ActivityStore = require('./stores/Activity')

module.exports = {
  showVolonteer: function(context, payload, cb) {
    // Pobierz dane wolontariusza z bazy danych
    context.service.read('Volonteers', payload, {
      store: 'Volonteer',
      // Przekaż obiekt zalogowanego użytkownia niezbędy do podjęcia
      // decyzji o tym jakie dane mają być zwrócone.
      user: context.getUser()
    }, function (err, data) {
      if (err) { console.log(err) }
      else { context.dispatch('LOAD_VOLONTEER', data) }
      cb()
    })
  },

  showVolonteers: function(context, payload, cb) {
    // Pobierz dane wolontariusza z bazy danych
    context.service.read('Volonteers', payload, {
      // Przekaż obiekt zalogowanego użytkownia niezbędy do podjęcia
      // decyzji o tym jakie dane mają być zwrócone.
      user: context.getUser()
    }, function (err, data) {
      if(err) { console.log(err) }
      else { context.dispatch('LOAD_VOLONTEERS', data) }
      cb()
    })
  },

  createVolonteer: function(context, payload, cb) {
    var volonteerStore = context.getStore(VolonteerStore)
    var volonteer = volonteerStore.createVolonteer(payload)

    context.service.create('Volonteers', volonteer, {}, function (err) {
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

    context.service.update('Volonteers', volonteer, {}, function (err) {
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
      // Przekaż obiekt zalogowanego użytkownia niezbędy do podjęcia
      // decyzji o tym jakie dane mają być zwrócone.
      user: context.getUser()
    }, function (err, data) {
      if(err) { console.log(err) }
      else { context.dispatch('LOAD_ACTIVITY', data) }
      cb()
    })
  },
  updateActivity: function(context, payload, cb) {
    console.log('update activity');
    context.service.update('Activities', payload, {
      store: 'Activity',
      user: context.getUser()
    }, function (err, data) {
        if(err) { console.log(err) }
        else { context.dispatch('ACTIVITY_UPDATED', data) }
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

  showResults: function(context, payload, cb) {

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

    request.send(JSON.stringify(payload))
  }
}
