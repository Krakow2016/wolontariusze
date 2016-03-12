'use strict'

var actions = require('./actions')

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
    handler: require('./components/Volunteer/Profile.jsx'),
    action: function (context, payload, done) {
      var volunteerId  = payload.params.id
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Profil wolontariusza' })
      context.executeAction(actions.showVolunteer, { id: volunteerId }, function() {
        done()
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
        done()
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
        context.executeAction(actions.showXls, { email: data.email }, function() {
          context.service.read('Comments', {volunteerId: volunteerId}, {}, function (err, data) {
            context.dispatch('LOAD_COMMENTS', data)
            done()
          })
        })
      })
    }
  },

  open_tasks: {
    path: '/zadania',
    method: 'get',
    handler: require('./components/TaskBank/OpenTasks.jsx'),
    action: function(context, payload, done) {
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Bank pracy' })
      context.executeAction(actions.loadActivities, payload.query, function() {
        done()
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
        context.dispatch('UPDATE_PAGE_TITLE', { title: activity.name })
        done()
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
        context.dispatch('UPDATE_PAGE_TITLE', { title: activity.name })
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
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Wyszukiwarka' })
      context.dispatch('LOAD_QUERY', payload.query)
      context.executeAction(actions.showResults, payload.query)
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
  }
}
