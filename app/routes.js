'use strict'

var actions = require('./actions')
var navigateAction = require('fluxible-router').navigateAction

module.exports = {
  home: {
    path: '/',
    method: 'get',
    handler: require('./components/Index.jsx'),
    action: function (context, payload, done) {
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Strona główna' })
      done()
    }
  },

  terms: {
    path: '/regulamin',
    method: 'get',
    handler: require('./components/Terms.jsx'),
    action: function (context, payload, done) {
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Regulamin' })
      done()
    }
  },

  registration: {
    path: '/rejestracja',
    method: 'get',
    handler: require('./components/Registration.jsx'),
    action: function (context, payload, done) {
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Dodaj nowe konto w systemie' })
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
    handler: require('./components/Volunteer/Profile.jsx'),
    action: function (context, payload, done) {
      var volunteerId  = payload.params.id
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Profil wolontariusza' })
      context.executeAction(actions.showVolunteer, { id: volunteerId }, function(data) {
        if(!data) {
          context.dispatch('SAVE_FLASH_FAILURE', 'Błąd: Użytkownik nie istnieje w systemie.')
          context.executeAction(navigateAction, {
            url: '/'
          }, done)
        } else {
          done()
        }
      })
    }
  },

  volunteer_activities: {
    path: '/wolontariusz/:id/aktywnosci',
    method: 'get',
    handler: require('./components/Volunteer/Activities.jsx'),
    action: function (context, payload, done) {
      var volunteerId  = payload.params.id
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Aktywności wolontariusza' })
      context.executeAction(actions.showVolunteer, { id: volunteerId }, function() {
        context.executeAction(actions.showVolunteerActivity, { id: volunteerId }, function() {
          done()
        })
      })
    }
  },

  volunteer_calendar: {
    path: '/wolontariusz/:id/grafik',
    method: 'get',
    handler: require('./components/Volunteer/Calendar.jsx'),
    action: function (context, payload, done) {
      var volunteerId  = payload.params.id
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Grafik wolontariusza' })
      context.executeAction(actions.showVolunteer, { id: volunteerId }, function() {
        done()
      })
    }
  },

  volunteer_administration: {
    path: '/wolontariusz/:id/admin',
    method: 'get',
    handler: require('./components/Volunteer/Administration.jsx'),
    action: function (context, payload, done) {
      var volunteerId  = payload.params.id
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Szczegóły wolontariusza' })
      context.executeAction(actions.showVolunteer, { id: volunteerId }, function(data) {
        if(!data) {
          context.dispatch('SAVE_FLASH_FAILURE', 'Błąd: Użytkownik nie istnieje w systemie.')
          context.executeAction(navigateAction, {
            url: '/'
          }, done)
        } else {
          context.executeAction(actions.showXls, { email: data.email }, function() {
            context.service.read('Comments', {volunteerId: volunteerId}, {}, function (err, data) {
              context.dispatch('LOAD_COMMENTS', data)
              done()
            })
          })
        }
      })
    }
  },

  open_tasks: {
    path: '/zadania',
    method: 'get',
    handler: require('./components/TaskBank/Bank.jsx'),
    action: function(context, payload, done) {
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Bank pracy' })
      context.dispatch('LOAD_ACTIVITIES_QUERY', payload.query)
      context.executeAction(actions.loadActivities, payload.query, function(err) {
        if(!err) {
          done()
        }
      })
    }
  },

  activity_creation: {
    path: '/zadania/nowe',
    method: 'get',
    handler: require('./components/ActivityCreate.jsx'),
    action: function (context, payload, done) {
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Nowa Aktywnosc' })
      context.dispatch('PRECREATE_ACTIVITY', {})
      done()
    }
  },

  activity: {
    path: '/zadania/:id',
    method: 'get',
    handler: require('./components/Activity.jsx'),
    action: function (context, payload, done) {
      var activityId  = payload.params.id


      context.executeAction(actions.showActivity, { id: activityId }, function(activity) {
        if(activity) {
          context.dispatch('UPDATE_PAGE_TITLE', { title: activity.name })
          done()
        } else {
          context.dispatch('SAVE_FLASH_FAILURE', 'Błąd: musisz być zalogowany żeby zobaczyć zadanie.')
          context.executeAction(navigateAction, {
            url: '/'
          }, done)
        }
      })
    }
  },

  activity_edition: {
    path: '/zadania/:id/edytuj',
    method: 'get',
    handler: require('./components/ActivityEdit.jsx'),
    action: function (context, payload, done) {
      var activityId  = payload.params.id
      context.executeAction(actions.showActivity, { id: activityId }, function(activity) {
        if(activity) {
          context.dispatch('UPDATE_PAGE_TITLE', { title: activity.name })
        }
        done()
      })
    }
  },

  login: {
    path: '/login',
    method: 'get',
    handler: require('./components/Login.jsx'),
    action: function (context, payload, done) {
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Zaloguj się' })
      done()
    }
  },

  settings: {
    path: '/ustawienia',
    method: 'get',
    handler: require('./components/Settings/Settings.jsx'),
    action: function (context, payload, done) {
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Ustawienia' })
      var user = context.getUser()
      if(user) {
        context.executeAction(actions.showVolunteer, { id: user.id }, function() {
          context.executeAction(actions.showIntegrations, { user_id: user.id }, function() {
            done()
          })
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

  search: {
    path: '/wyszukiwarka',
    method: 'get',
    handler: require('./components/Search.jsx'),
    action: function(context, payload, done) {
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Wyszukiwarka' })
      context.dispatch('LOAD_QUERY', payload.query)
      context.executeAction(actions.showResults, payload.query)
      done()
    }
  },

  why_gd: {
    path: '/czemu-gora-dobra',
    method: 'get',
    handler: require('./components/Texts/Why.jsx'),
    action: function(context, payload, done){
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Czemu Góra Dobra?' })
      context.dispatch('LOAD_QUERY', payload.query)
      done()
    }
  },

  what_gd: {
    path: '/czym-jest-gora-dobra',
    method: 'get',
    handler: require('./components/Texts/What.jsx'),
    action: function(context, payload, done){
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Czym Jest Góra Dobra?' })
      context.dispatch('LOAD_QUERY', payload.query)
      done()
    }
  },

  how_works: {
    path: '/jak-dziala-gora-dobra',
    method: 'get',
    handler: require('./components/Texts/How.jsx'),
    action: function(context, payload, done){
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Jak Działa Góra Dobra?' })
      context.dispatch('LOAD_QUERY', payload.query)
      done()
    }
  },

  who_works: {
    path: '/kto-jest-zaangazowany',
    method: 'get',
    handler: require('./components/Texts/Who.jsx'),
    action: function(context, payload, done){
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Kto Jest Zaangażowany?' })
      context.dispatch('LOAD_QUERY', payload.query)
      done()
    }
  },


  import: {
    path: '/import',
    method: 'get',
    handler: require('./components/Import.jsx'),
    action: function(context, payload, done) {
      done()
    }
  },

  account_activation: {
    path: '/aktywacja',
    method: 'get',
    handler: require('./components/AccountActivation.jsx'),
    action: function(context, payload, done) {
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Aktywuj konto' })
      done()
    }
  }


}
