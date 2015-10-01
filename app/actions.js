'use strict'

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
  profileCommentsRead: function(context, payload, cb) {
      console.log('profile comment read')
    context.service.read('profileComments', payload, {}, function (err, data) {
      context.dispatch('PROFILE_COMMENTS_READ', data);
      cb()
    })
  },
  profileCommentsCreate: function(context, payload, cb) {
      console.log('profile comment create')
    context.service.create('profileComments', payload, {}, function (err, data) {
      context.dispatch('PROFILE_COMMENTS_CREATE', data);
      cb()
    })
  },
   profileCommentsUpdate: function(context, payload, cb) {
      console.log('profile comment update')
    context.service.update('profileComments', payload, {}, function (err, data) {
      context.dispatch('PROFILE_COMMENTS_UPDATE', data);
      cb()
    })
  },
  profileCommentsDelete: function(context, payload, cb) {
      console.log('profile comment delete')
    context.service.delete('profileComments', payload, {}, function (err, data) {
      context.dispatch('PROFILE_COMMENTS_DELETE', data);
      cb()
    })
  }
}
