'use strict'

var VolonteerStore = require('./stores/VolonteerStore')

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

      context.service.create('volonteers', volonteer, {}, function (err) {
        if (err) { // Błąd po stronie serwera
            //debug('dispatching CREATE_VOLONTEER_FAILURE', volonteer)
            context.dispatch('CREATE_VOLONTEER_FAILURE', [volonteer])
            cb()
            return
        }
        //debug('dispatching CREATE_VOLONTEER_SUCCESS', volonteer)
        context.dispatch('CREATE_VOLONTEER_SUCCESS', [volonteer])
        cb()
    });
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
  }
}
