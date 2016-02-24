'use strict'

var debug = require('debug')('Actions')
var VolunteerStore = require('./stores/Volunteer')
var navigateAction = require('fluxible-router').navigateAction
var request = require('superagent')

module.exports = {

  showIndex: function(context, payload, cb) {
    // Pobierz statystyki systemu
    request
      .get('/stats')
      .end(function (err, data) {
        if (err) { debug(err) }
        else { context.dispatch('LOAD_INDEX', data.body) }
        cb()
      })
  },

  showVolunteer: function(context, payload, cb) {
    // Pobierz dane wolontariusza z bazy danych
    context.service.read('Volunteers', payload, {},
      function (err, data) {
        if (err) { debug(err) }
        else { context.dispatch('LOAD_VOLUNTEER', data) }
        cb(data)
      }
    )
  },

  showVolunteers: function(context, payload, cb) {
    // Pobierz dane wolontariusza z bazy danych
    context.service.read('Volunteers', payload, {},
      function (err, data) {
        if(err) { debug(err) }
        else { context.dispatch('LOAD_VOLUNTEERS', data) }
        cb()
      }
    )
  },

  createVolunteer: function(context, payload, cb) {
    var volunteerStore = context.getStore(VolunteerStore)
    var volunteer = volunteerStore.createVolunteer(payload)

    context.service.create('Volunteers', {}, volunteer, function (err, resp) {
      if (err) { // Błąd po stronie serwera
        context.dispatch('VOLUNTEER_CREATION_FAILURE', [volunteer])
      } else {
        context.executeAction(navigateAction, {
          url: '/wolontariusz/'+ resp.generated_keys[0] +'/admin'
        })
      }
      cb()
    })
  },

  updateVolunteer: function(context, payload, cb) {
    var volunteerStore = context.getStore(VolunteerStore)
    var volunteer = volunteerStore.createVolunteer(payload)

    context.service.update('Volunteers', {}, volunteer, function (err) {
      if (err) { // Błąd po stronie serwera
        context.dispatch('VOLUNTEER_UPDATE_FAILURE')
      } else {
        context.dispatch('VOLUNTEER_UPDATE_SUCCESS', volunteer)
      }
      cb()
    })
  },

  updateProfilePicture: function(context, payload, cb) {
    var r = request.post('/upload')

    r.attach('avatar', payload[0])
    r.end(function(err, resp){
      console.log(resp)
      context.dispatch('VOLUNTEER_UPDATE_SUCCESS', resp.body)
      cb()
    })
  },

  showXls: function(context, payload, cb) {
    // Pobierz dane wolontariusza z bazy danych
    context.service.read('Xls', payload, {},
      function (err, data) {
        if (err) { debug(err) }
        else { context.dispatch('LOAD_XLS', data) }
        cb()
      }
    )
  },

  showActivity: function(context, payload, cb) {
    // Pobierz dane aktywności z bazy danych
    context.service.read('Activities', payload, {
      store: 'Activity'
    }, function (err, data) {
      if(err) { debug(err) }
      else { context.dispatch('LOAD_ACTIVITY', data) }
      cb()
    })
  },

  loadActivities: function(context, payload, cb) {
    // Pobierz dane wolontariusza z bazy danych
    context.service.read('Activities', payload, {
    }, function (err, data) {
      if(err) { debug(err) }
      else { context.dispatch('LOAD_ACTIVITIES', data) }
      cb()
    })
  },

  updateActivity: function(context, payload, cb) {
    context.service.update('Activities', {}, payload, function (err, data) {
      if(err) { debug(err) }
      else {
        var change = data.changes[0]
        if(change) {
          context.dispatch('ACTIVITY_UPDATED', change.new_val)
        }
      }
      cb()
    })
  },

  joinActivity: function(context, payload, cb) {
    context.service.create('Joints', {}, payload, function (err, data) {
      if (err) { // Błąd po stronie serwera
        //context.dispatch('JOINT_CREATED_FAILURE', [])
      } else {
        var user = context.getUser()
        context.dispatch('JOINT_CREATED', Object.assign({}, user, {
          id: data.generated_keys[0],
          user_id: user.id
        }))
      }
      cb()
    })
  },

  assignActivity: function(context, payload, cb) {
    context.service.create('Joints', {}, payload, function (err, data) {
      if (err) { // Błąd po stronie serwera
        //context.dispatch('JOINT_CREATED_FAILURE', [])
      } else {
        // Nie musimy nic robić - interface został już zaktualizowany
        cb()
      }
    })
  },

  leaveActivity: function(context, payload, cb) {
    var params = {id: payload.id, ids: payload.ids}
    context.service.update('Joints', params, payload.body, function (err, data) {
      if (err) { // Błąd po stronie serwera
        //context.dispatch('JOINT_UPDATE_FAILURE', [])
      } else {
        var ids = params.ids || [params.id]
        ids.forEach(function(id) {
          context.dispatch('JOINT_DELETED', id)
        })
      }
      cb()
    })
  },

  createActivity: function(context, payload, cb) {
    context.service.create('Activities', {}, payload.activity, function (err, data) {
      if(err) { debug(err) }
      else {
        var id = data.generated_keys[0]
        var joints = payload.volunteers.map(function(volunteer){
          return {
            activity_id: id,
            user_id: volunteer.user_id
          }
        })
        context.service.create('Joints', {}, joints, function(){
          context.executeAction(navigateAction, {url: '/aktywnosc/'+id})
          cb()
        })
      }
    })
  },

  deleteActivity: function(context, payload, cb) {
    context.service.delete('Activities', payload, {user: context.getUser()}, function (err, data) {
      if(err) { debug(err) }
      else {
        context.dispatch('ACTIVITY_DELETED', data)
        context.executeAction(navigateAction, {url: '/'})
      }
      cb()
    })
  },
  
  createActivityTag: function(context, payload, cb) {
    context.service.create('ActivityTags', {}, payload, function (err, data) {
      if (err) { // Błąd po stronie serwera
      } else {
        cb()
      }
    })
  },

  removeActivityTag: function(context, payload, cb) {
    var params = {id: payload.id, ids: payload.ids}
    context.service.update('ActivityTags', params, payload.body, function (err, data) {
      if (err) { // Błąd po stronie serwera
        //context.dispatch('JOINT_UPDATE_FAILURE', [])
      } else {
        var ids = params.ids || [params.id]
        ids.forEach(function(id) {
          context.dispatch('ACTIVITY_TAG_DELETED', id)
        })
      }
      cb()
    })
  },
  
  showTasks: function(context, payload, cb) {
    var user = context.getUser()
    context.service.read('Activities', Object.assign({}, payload, {
      user_id: user.id
    }), {}, function (err, data) {
      if(err) { debug(err) }
      else { 
        context.dispatch('LOAD_TASKS', data) }
      cb()
    })
  },

  createComment: function(context, payload, cb) {
    debug('profile comment create')
    context.service.create('Comments', payload, {}, function (err, data) {
      if(err) { debug(err) }
      else { context.dispatch('COMMENT_CREATED', data) }
      cb()
    })
  },

  profileCommentsUpdate: function(context, payload, cb) {
    debug('profile comment update')
    context.service.update('Comments', {}, payload, function (err) {
      if(err) { debug(err) }
      else { context.dispatch('COMMENT_UPDATED', payload) }
      cb()
    })
  },

  profileCommentsDelete: function(context, payload, cb) {
    debug('profile comment delete')
    context.service.delete('Comments', payload, {}, function (err) {
      if(err) { debug(err) }
      else { context.dispatch('COMMENT_DELETED', payload) }
      cb()
    })
  },

  showIntegrations: function(context, payload, cb) {
    // Pobierz dane wolontariusza z bazy danych
    context.service.read('Integrations', payload, {},
      function (err, data) {
        if (err) { debug(err) }
        else { context.dispatch('LOAD_INTEGRATIONS', data) }
        cb()
      }
    )
  },

  showAPIClients: function(context, payload, cb) {
    // Pobierz dane wolontariusza z bazy danych
    context.service.read('APIClients', payload, {},
      function (err, data) {
        if (err) { debug(err) }
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
        context.executeAction(navigateAction, {url: '/ustawienia/developer'})
        context.dispatch('APICLIENT_CREATION_SUCCESS', [payload])
      }
      cb()
    })
  },

  showResults: function(context, state, cb) {

    //var age_from = parseInt(state['age-from'])
    //var age_to = parseInt(state['age-to'])

    var doc_must = []
    var doc_should = []
    var raw_must = []
    var raw_should = []

    if(state.name) {
      doc_should.push({
        multi_match: {
          query: state.name,
          fields: ['doc.first_name', 'doc.last_name'],
        }
      })
    }

    if(state.email) {
      doc_should.push({
        term: { 'doc.email': state.email }
      })
    }

    if(state['doc.is_admin']) {
      doc_must.push({
        term: { 'doc.is_admin': true }
      })
    }

    if(state['doc.has_password']) {
      doc_must.push({
        term: { 'doc.has_password': true }
      })
    }

    if(state['raw.is_volunteer']) {
      raw_must.push({
        exists: { 'field': 'raw.id' }
      })
    }

    if(state.departments) {
      raw_should.push({
        match: { 'raw.cd_sectors': state.departments }
      })
    }

    if(state.skills) {
      raw_should.push({
        match: { 'raw.sk_skills': state.skills }
      })
    }

    var should = []

    if(doc_should.length || doc_must.length) {
      should.push({
        nested: {
          path: 'doc',
          query : {
            bool: {
              should: doc_should,
              must: doc_must
            }
          }
        }
      })
    }

    if(raw_should.length || raw_must.length) {
      should.push({
        nested: {
          path: 'raw',
          query : {
            bool: {
              should: raw_should,
              must: raw_must
            }
          }
        }
      })
    }

    // Nie wpisano żadnego zapytania
    if(!should.length) {
        return
    }

    var query = {
      bool: {
        should: should,
        minimum_should_match: should.length
      }
    }

    var params = {
      size: 100,
      query : {
        function_score: {
          query: query,
          functions: [],
          score_mode: 'avg'
        }
      }
      //explain: true,
    }

    // Jęzkyki
    //var language = state.language
    //var language_keys = language ? Object.keys(language) : []
    //language_keys.forEach(function(key){
      //if(language[key]) {
        //var lang_range = {}
        //lang_range['languages.'+key+'.level'] = { gte: 1, lte: 10 }
        //filtered.query.bool.must.push({range: lang_range})
        //query.query.function_score.functions.push({
          //field_value_factor: {
            //'field' : 'languages.'+key+'.level',
            //'modifier' : 'square'
          //}
        //})
      //}
    //})

    //if(state.other_val) {
      //var val = state.other_val
      //var other_lang_range = {}
      //other_lang_range['languages.'+val+'.level'] = { gte: 1, lte: 10 }
      //filtered.query.bool.must.push({range: other_lang_range})
      //query.query.function_score.functions.push({
        //field_value_factor: {
          //'field' : 'languages.'+val+'.level',
          //'modifier' : 'square'
        //}
      //})
    //}

    //// Uczestnictwo w poprzednich Światowych Dniach Młodzieży
    //var wyds = state.wyd
    //var wyds_keys = wyds ? Object.keys(wyds) : []
    //if(wyds_keys.length) {
      //filtered.filter.and = []
      //wyds_keys.forEach(function(key){
        //if(wyds[key]) {
          //filtered.filter.and.push({
            //exists: { field: 'previous_wyd.'+key }
          //})
        //}
      //})
    //}

    //if(age_from || age_to) {
      //var today = new Date()
      //var age_range = {
        //range: {
          //birth_date: {}
        //}
      //}

      //if(age_from) {
        //age_range.range.birth_date.lte = new Date(new Date().setMonth(today.getMonth() - 12*(age_from-1)))
      //}

      //if(age_to) {
        //age_range.range.birth_date.gte = new Date(new Date().setMonth(today.getMonth() - 12*age_to))
      //}

      //if(filtered.filter.and) {
        //filtered.filter.and.push(age_range)
      //} else {
        //filtered.filter.and = [age_range]
      //}
    //}

    var request = new XMLHttpRequest()
    request.open('POST', '/search', true)
    request.setRequestHeader('Content-Type', 'application/json')
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var resp = request.responseText
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

    request.send(JSON.stringify(params))

    var base = window.location.toString().replace(new RegExp('[?](.*)$'), '')
    var attributes = Object.keys(state).filter(function(key) {
      return state[key]
    }).map(function(key) {
      return key + '=' + state[key]
    }).join('&')

    history.replaceState({}, '', base +'?'+ attributes)
  },

  inviteUser: function(context, user) {
    var query = {id: user.id}
    var request = new XMLHttpRequest()
    request.open('POST', '/invitation', true)
    request.setRequestHeader('Content-Type', 'application/json')
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var resp = request.responseText
        var json = JSON.parse(resp)

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
