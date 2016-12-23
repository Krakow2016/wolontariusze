'use strict'

var actions = require('./actions')
var navigateAction = require('fluxible-router').navigateAction

module.exports = {
  home: {
    path: '/',
    method: 'get',
    handler: require('./components/Index.jsx'),
    action: function (context, payload, done) {
      context.dispatch('LOAD_URL', '/')
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Strona główna' })
      done()
    }
  },

  terms: {
    path: '/regulamin',
    method: 'get',
    handler: require('./components/Terms.jsx'),
    action: function (context, payload, done) {
      context.dispatch('LOAD_URL', '/regulamin')
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Regulamin' })
      done()
    }
  },

  registration: {
    path: '/rejestracja',
    method: 'get',
    handler: require('./components/Registration.jsx'),
    action: function (context, payload, done) {
      context.dispatch('LOAD_URL', '/rejestracja')
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Dodaj nowe konto w systemie' })
      done()
    }
  },

  welcome: {
    path: '/witaj',
    method: 'get',
    handler: require('./components/Welcome.jsx'),
    action: function (context, payload, done) {
      context.dispatch('LOAD_URL', '/witaj')
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
      context.dispatch('LOAD_URL', '/wolontariusz/'+volunteerId)
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Profil wolontariusza' })
      context.executeAction(actions.showVolunteer, { id: volunteerId }, function(data) {
        if(!data) {
          context.dispatch('SAVE_FLASH_FAILURE', 'Błąd: Użytkownik nie istnieje w systemie.')
          context.executeAction(navigateAction, {
            url: '/login'
          }, done)
        } else {
          context.executeAction(actions.showVolunteerActivity, { id: volunteerId }, function() {
          done()
        })
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
      context.dispatch('LOAD_URL', '/wolontariusz/'+volunteerId+'/aktywnosci')
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Aktywności wolontariusza' })
      context.executeAction(actions.showVolunteer, { id: volunteerId }, function() {
        context.executeAction(actions.showVolunteerActivity, { id: volunteerId }, function() {
          done()
        })
      })
    }
  },

  volunteer_administration: {
    path: '/wolontariusz/:id/admin',
    method: 'get',
    handler: require('./components/Volunteer/Administration.jsx'),
    action: function (context, payload, done) {
      var volunteerId  = payload.params.id
      context.dispatch('LOAD_URL', '/wolontariusz/'+volunteerId+'/admin')
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Szczegóły wolontariusza' })
      context.executeAction(actions.showVolunteer, { id: volunteerId }, function(data) {
        if(!data) {
          context.dispatch('SAVE_FLASH_FAILURE', 'Błąd: Użytkownik nie istnieje w systemie.')
          context.executeAction(navigateAction, {
            url: '/login'
          }, done)
        } else {
          context.executeAction(actions.showXls, { email: data.email }, function() {
            context.service.read('Comments', {volunteerId: volunteerId, activityId: null}, {}, function (err, data) {
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
      context.dispatch('LOAD_URL', '/zadania')
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Bank pracy' })
      context.dispatch('LOAD_ACTIVITIES_QUERY', payload.query)
      context.executeAction(actions.loadActivities, payload.query, function(err, data) {
        if(err) {
          context.dispatch('SAVE_FLASH_FAILURE', 'Błąd: Użytkownik nie istnieje w systemie.')
            context.executeAction(navigateAction, {
              url: '/login',
            }, done)
        } else {
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
      context.dispatch('LOAD_URL', '/zadania/nowe')
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
      context.dispatch('LOAD_URL', '/zadania/'+activityId)
      context.executeAction(actions.showActivity, { id: activityId }, function(activity) {
        if(activity) {
          context.dispatch('UPDATE_PAGE_TITLE', { title: activity.name })
          context.service.read('Comments', {volunteerId: null, activityId: activityId}, {}, function (err, data) {
            context.dispatch('LOAD_COMMENTS', data)
            done()
          })
        } else {
          context.dispatch('SAVE_FLASH_FAILURE', 'Błąd: musisz być zalogowany żeby zobaczyć zadanie.')
          context.executeAction(navigateAction, {
            url: '/login'
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
      context.dispatch('LOAD_URL', '/zadania/'+activityId+'/edytuj')
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
      //BRAK LOAD_URL
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Zaloguj się' })
      done()
    }
  },

  settings: {
    path: '/ustawienia',
    method: 'get',
    handler: require('./components/Settings/Settings.jsx'),
    action: function (context, payload, done) {
      context.dispatch('LOAD_URL', '/ustawienia')
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Ustawienia' })
      var user = context.getUser()
      if(user) {
        context.executeAction(actions.showVolunteer, { id: user.id }, function(data) {
          if(!data) {
            context.dispatch('SAVE_FLASH_FAILURE', 'Błąd: Użytkownik nie istnieje w systemie.')
            context.executeAction(navigateAction, {
              url: '/login'
            }, done)
          } else {
            context.executeAction(actions.showIntegrations, { user_id: user.id }, function() {
              done()
            })
          }
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
      context.dispatch('LOAD_URL', '/ustawienia/developer')
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
      context.dispatch('LOAD_URL', '/wyszukiwarka')
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Wyszukiwarka' })
      context.dispatch('LOAD_QUERY', payload.query)
      context.executeAction(actions.showResults, payload.query)
      done()
    }
  },


  news: {
    path: '/aktualnosci(;page=)?:pagenumber(\\d?)',
    method: 'get',
    handler: require('./components/News.jsx'),
    action: function (context, payload, done) {
      var activityId  = 'news'
      var pageNumber = 1
      context.dispatch('LOAD_URL', '/aktualnosci;page='+pageNumber)
      if (payload.params.pagenumber) {
        pageNumber = payload.params.pagenumber
      }
      context.executeAction(actions.showActivity, { id: activityId, page: pageNumber }, function(activity) {
        if(activity) {
          context.dispatch('UPDATE_PAGE_TITLE', { title: activity.name })
          done()
        } else {
          context.dispatch('SAVE_FLASH_FAILURE', 'Błąd: musisz być zalogowany żeby zobaczyć zadanie.')
          context.executeAction(navigateAction, {
            url: '/login'
          }, done)
        }
      })
    }
  },

  what_we_do: {
    path: '/co-robimy(;page=)?:pagenumber(\\d?)',
    method: 'get',
    handler: require('./components/WhatWeDo.jsx'),
    action: function (context, payload, done) {
      var activityId  = 'what-we-do'
      var pageNumber = 1
      if (payload.params.pagenumber) {
        pageNumber = payload.params.pagenumber
      }
      context.dispatch('LOAD_URL', '/co-robimy;page='+pageNumber)
      context.executeAction(actions.showActivity, { id: activityId, page: pageNumber}, function(activity) {
        if(activity) {
          context.dispatch('UPDATE_PAGE_TITLE', { title: activity.name })
        } 
        done()
      })
    }
  },

  what_we_do_with_link: {
    path: '/co-robimy;link=:plink',
    method: 'get',
    handler: require('./components/WhatWeDo.jsx'),
    action: function (context, payload, done) {
      var activityId  = 'what-we-do'
      var link = ""
      if (payload.params.plink) {
        link = payload.params.plink
      }
      context.dispatch('LOAD_URL', '/co-robimy;link='+link)
      context.executeAction(actions.showActivity, { id: activityId, link: link }, function(activity) {
        if(activity) {
          context.dispatch('UPDATE_PAGE_TITLE', { title: activity.name })
        } 
        done()
      })
    }
  },

  why_gd: {
    path: '/czemu-gora-dobra',
    method: 'get',
    handler: require('./components/Texts/Why.jsx'),
    action: function(context, payload, done){
      context.dispatch('LOAD_URL', '/czemu-gora-dobra')
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Czemu Góra Dobra?' })
      done()
    }
  },

  what_gd: {
    path: '/czym-jest-gora-dobra',
    method: 'get',
    handler: require('./components/Texts/What.jsx'),
    action: function(context, payload, done){
      context.dispatch('LOAD_URL', '/czym-jest-gora-dobra')
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Czym Jest Góra Dobra?' })
      done()
    }
  },

  how_works: {
    path: '/jak-dziala-gora-dobra',
    method: 'get',
    handler: require('./components/Texts/How.jsx'),
    action: function(context, payload, done){
      context.dispatch('LOAD_URL', '/jak-dziala-gora-dobra')
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Jak Działa Góra Dobra?' })
      done()
    }
  },

  who_works: {
    path: '/kto-jest-zaangazowany',
    method: 'get',
    handler: require('./components/Texts/Who.jsx'),
    action: function(context, payload, done){
      context.dispatch('LOAD_URL', '/kto-jest-zaangazowany')
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Kto Jest Zaangażowany?' })
      done()
    }
  },
  contact: {
    path: '/kontakt',
    method: 'get',
    handler: require('./components/Contact.jsx'),
    action: function(context, payload, done){
      context.dispatch('LOAD_URL', '/kontakt')
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Kontakt' })
      done()
    }
  },
  meet: {
    path: '/spotkajmy-sie',
    method: 'get',
    handler: require('./components/Graph/MeetTogether.jsx'),
    action: function(context, payload, done){
      context.dispatch('LOAD_URL', '/spotkajmy-sie')
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Spotkajmy się!!' })
      done()
    }
  },
  faq: {
    path: '/faq',
    method: 'get',
    handler: require('./components/Texts/Faq.jsx'),
    action: function(context, payload, done){
      context.dispatch('LOAD_URL', '/faq')
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'FAQ' })
      done()
    }
  },


  import: {
    path: '/import',
    method: 'get',
    handler: require('./components/Import.jsx'),
    action: function(context, payload, done) {
      context.dispatch('LOAD_URL', '/import')
      done()
    }
  },

  account_activation: {
    path: '/aktywacja',
    method: 'get',
    handler: require('./components/AccountActivation.jsx'),
    action: function(context, payload, done) {
      context.dispatch('LOAD_URL', '/aktywacja')
      context.dispatch('UPDATE_PAGE_TITLE', { title: 'Aktywuj konto' })
      done()
    }
  }


}
