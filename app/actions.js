'use strict'

module.exports = {
  showVolonteer: function(context, payload, cb) {
    // Pobierz dane wolontariusza z bazy danych
    context.service.read('Volonteers', payload, {
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
    console.log('payload', payload)
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

  showActivity: function(context, payload, cb) {
    // Pobierz dane aktywności z bazy danych
    context.service.read('Activity', payload, {
      // Przekaż obiekt zalogowanego użytkownia niezbędy do podjęcia
      // decyzji o tym jakie dane mają być zwrócone.
      user: context.getUser()
    }, function (err, data) {
      context.dispatch('LOAD_ACTIVITY', data);
      cb()
    })
  }
}
