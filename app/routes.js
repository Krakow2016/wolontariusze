'use strict'

var actions = require('./actions')

module.exports = {
  home: {
    path: '/',
    method: 'get',
    handler: require('./components/Index.jsx'),
    action: function (context, payload, done) {
      context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: 'Home | flux-examples | routing' })
      done()
    }
  },

  registration: {
    path: '/rejestracja',
    method: 'get',
    handler: require('./components/Registration.jsx'),
    action: function (context, payload, done) {
      done()
    }
  },

  welcome: {
    path: '/witaj',
    method: 'get',
    handler: require('./components/Welcome.jsx'),
    action: function (context, payload, done) {
      var user = context.getUser()
      context.executeAction(actions.showVolunteer, { id: user.id }, function() {
        done()
      })
    }
  },

  volunteer: {
    path: '/wolontariusz/:id',
    method: 'get',
    handler: require('./components/Volunteer.jsx'),
    action: function (context, payload, done) {
      var volunteerId  = payload.params.id
      context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: volunteerId + ' [Dynamic Page] | flux-examples | routing' })
      context.executeAction(actions.showVolunteer, { id: volunteerId }, function() {
        done()
      })
    }
  },

  volunteer_administration: {
    path: '/wolontariusz/:id/admin',
    method: 'get',
    handler: require('./components/VolunteerAdministration.jsx'),
    action: function (context, payload, done) {
      var volunteerId  = payload.params.id
      context.executeAction(actions.showVolunteer, { id: volunteerId }, function() {
        done()
      })
    }
  },

  activity: {
    path: '/aktywnosc/:id',
    method: 'get',
    handler: require('./components/Activity.jsx'),
    action: function (context, payload, done) {
      var activityId  = payload.params.id
      context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: activityId + ' Aktywnosc' })
      context.executeAction(actions.showActivity, { id: activityId }, function() {
        done()
      })
    }
  },

  activity_edition: {
    path: '/aktywnosc/:id/edytuj',
    method: 'get',
    handler: require('./components/ActivityEdit.jsx'),
    action: function (context, payload, done) {
      var activityId  = payload.params.id
      context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: activityId + ' Edytuj Aktywnosc' })
      context.executeAction(actions.showActivity, { id: activityId }, function() {
        done()
      })
    }
  },

  activity_creation: {
    path: '/nowa_aktywnosc',
    method: 'get',
    handler: require('./components/ActivityCreate.jsx'),
    action: function (context, payload, done) {
      context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: 'Nowa Aktywnosc' })
      context.dispatch('LOAD_ACTIVITY', {})
      done()
    }
  },

  login: {
    path: '/login',
    method: 'get',
    handler: require('./components/Login.jsx'),
    action: function (context, payload, done) {
      context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: 'Home | flux-examples | routing' })
      done()
    }
  },

  account_settings: {
    path: '/ustawienia/konto',
    method: 'get',
    handler: require('./components/Settings/Basic.jsx'),
    action: function (context, payload, done) {
      var user = context.getUser()
      if(user) {
        context.executeAction(actions.showVolunteer, { id: user.id }, function() {
          done()
        })
      } else {
        done()
      }
    }
  },

  profil_settings: {
    path: '/ustawienia/profil',
    method: 'get',
    handler: require('./components/Settings/Info.jsx'),
    action: function (context, payload, done) {
      var user = context.getUser()
      if(user) {
        context.executeAction(actions.showVolunteer, { id: user.id }, function() {
          done()
        })
      } else {
        done()
      }
    }
  },

  applications_settings: {
    path: '/ustawienia/aplikacje',
    method: 'get',
    handler: require('./components/Settings/Integrations.jsx'),
    action: function (context, payload, done) {
      var user = context.getUser()
      if(user) {
        context.executeAction(actions.showIntegrations, { user_id: user.id }, function() {
          done()
        })
      } else {
        done()
      }
    }
  },

  developer_settings: {
    path: '/ustawienia/developer',
    method: 'get',
    handler: require('./components/Settings/Developer.jsx'),
    action: function (context, payload, done) {
      var user = context.getUser()
      if(user) {
        context.executeAction(actions.showAPIClients, { user_id: user.id }, function() {
          done()
        })
      } else {
        done()
      }
    }
  },

  develop_settings: {
    path: '/ustawienia/developer/utworz',
    method: 'get',
    handler: require('./components/Settings/Develop.jsx'),
    action: function (context, payload, done) {
      done()
    }
  },

  search: {
    path: '/wyszukiwarka',
    method: 'get',
    handler: require('./components/Search.jsx'),
    action: function(context, payload, done) {
      done()
    }
  }
}
