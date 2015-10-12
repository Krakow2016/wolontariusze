'use strict'

var VolonteerStore = require('./stores/Volonteer')

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

  showActivity: function(context, payload, cb) {
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
  }
}
