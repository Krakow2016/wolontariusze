'use strict'

var VolunteerStore = require('./stores/Volunteer')

module.exports = {
  showVolunteer: function(context, payload, cb) {
    // Pobierz dane wolontariusza z bazy danych
    context.service.read('Volunteers', payload, {},
      function (err, data) {
        if (err) { console.log(err) }
        else { context.dispatch('LOAD_VOLUNTEER', data) }
        cb()
      }
    )
  },

  showVolunteers: function(context, payload, cb) {
    // Pobierz dane wolontariusza z bazy danych
    context.service.read('Volunteers', payload, {},
      function (err, data) {
        if(err) { console.log(err) }
        else { context.dispatch('LOAD_VOLUNTEERS', data) }
        cb()
      }
    )
  },

  createVolunteer: function(context, payload, cb) {
    var volunteerStore = context.getStore(VolunteerStore)
    var volunteer = volunteerStore.createVolunteer(payload)

    context.service.create('Volunteers', {}, volunteer, function (err) {
      if (err) { // Błąd po stronie serwera
        context.dispatch('VOLUNTEER_CREATION_FAILURE', [volunteer])
      } else {
        context.dispatch('VOLUNTEER_CREATION_SUCCESS', [volunteer])
      }
      cb()
    })
  },

  updateVolunteer: function(context, payload, cb) {
    var volunteerStore = context.getStore(VolunteerStore)
    var volunteer = volunteerStore.createVolunteer(payload)

    context.service.update('Volunteers', {}, volunteer, function (err) {
      if (err) { // Błąd po stronie serwera
        context.dispatch('VOLUNTEER_UPDATE_FAILURE', [volunteer])
      } else {
        context.dispatch('VOLUNTEER_UPDATE_SUCCESS', [volunteer])
      }
      cb()
    })
  },

  showActivity: function(context, payload, cb) {
    // Pobierz dane aktywności z bazy danych
    context.service.read('Activities', payload, {
      store: 'Activity',
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
    context.service.update('Comments', payload, {}, function (err) {
      if(err) { console.log(err) }
      else { context.dispatch('COMMENT_UPDATED', payload) }
      cb()
    })
  },

  profileCommentsDelete: function(context, payload, cb) {
    console.log('profile comment delete')
    context.service.delete('Comments', payload, {}, function (err) {
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

  showAPIClients: function(context, payload, cb) {
    // Pobierz dane wolontariusza z bazy danych
    context.service.read('APIClients', payload, {},
      function (err, data) {
        if (err) { console.log(err) }
        else { context.dispatch('LOAD_APICLIENTS', data) }
        cb()
      }
    )
  },

  createAPIClient: function(context, payload, cb) {
    context.service.create('APIClients', {}, payload, function (err) {
      if (err) { // Błąd po stronie serwera
        context.dispatch('APICLIENT_CREATION_FAILURE', [payload])
      } else {
        context.dispatch('APICLIENT_CREATION_SUCCESS', [payload])
      }
      cb()
    })
  },

  showResults: function(context, state, cb) {

    var age_from = parseInt(state['age-from'])
    var age_to = parseInt(state['age-to'])

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
        var lang_range = {}
        lang_range['languages.'+key+'.level'] = { gte: 1, lte: 10 }
        filtered.query.bool.must.push({range: lang_range})
        query.query.function_score.functions.push({
          field_value_factor: {
            "field" : "languages."+key+".level",
            "modifier" : "square"
          }
        })
      }
    })

    if(state.other_val) {
      var val = state.other_val
      var other_lang_range = {}
      other_lang_range['languages.'+val+'.level'] = { gte: 1, lte: 10 }
      filtered.query.bool.must.push({range: other_lang_range})
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
      var age_range = {
        range: {
          birth_date: {}
        }
      }

      if(age_from) {
        age_range.range.birth_date.lte = new Date(new Date().setMonth(today.getMonth() - 12*(age_from-1)))
      }

      if(age_to) {
        age_range.range.birth_date.gte = new Date(new Date().setMonth(today.getMonth() - 12*age_to))
      }

      if(filtered.filter.and) {
        filtered.filter.and.push(age_range)
      } else {
        filtered.filter.and = [age_range]
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

        context.dispatch('LOAD_RESULTS', json)
        cb()
      //} else {
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
      //} else {
      // We reached our target server, but it returned an error
      }
    }

    request.onerror = function() {
      // There was a connection error of some sort
    }

    request.send(JSON.stringify(query))
  }
}
