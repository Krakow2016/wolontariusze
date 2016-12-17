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
        if (err) { 
          debug(err) 
          context.dispatch('LOAD_VOLUNTEER', [])
        }
        else { context.dispatch('LOAD_VOLUNTEER', data) }
        cb(data)
      }
    )
  },

  showVolunteerActivity: function(context, payload, cb) {
    var query = {
      query: {
        nested: {
          path: 'doc',
          query: {
            bool: {
              must: [
                { term: { 'doc.volunteers': payload.id } },
                { or: [
                  {
                    term: {
                      'doc.is_archived': true
                    }
                  }, {
                    range: {
                      'doc.datetime': {
                        lte: 'now'
                      }
                    }
                  }
                ]}
              ]
            }
          }
        }
      }
    }
    context.service.create('ActivitiesES', {}, query, function (err, data) {
      if (err) {
        debug(err)
      } else {
        context.dispatch('LOAD_ACTIVITIES', {
          all: data
        })
      }
      cb(data)
    })
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
        context.dispatch('SAVE_FLASH_FAILURE', 'Wystąpił nieznany błąd')
        context.dispatch('VOLUNTEER_UPDATE_FAILURE')
      } else {
        context.dispatch('SAVE_FLASH_SUCCESS', 'Zapisano.')
        context.dispatch('VOLUNTEER_UPDATE_SUCCESS', volunteer)
      }
      cb()
    })
  },

  updateProfilePicture: function(context, payload, cb) {
    var r = request.post('/upload')

    r.attach('avatar', payload[0])
    r.end(function(err, resp){
      //console.log(resp)
      context.dispatch('VOLUNTEER_UPDATE_SUCCESS', resp.body)
      cb()
    })
  },

  removeVolunteerData: function(context, payload, cb) {
    request
      .post('/removeVolunteerData')
      .send(payload)
      .end(function(err, resp){
        if(err) {
          context.dispatch('SAVE_FLASH_FAILURE', 'Wystąpił nieznany błąd 1')
          context.dispatch('VOLUNTEER_REMOVEDATA_FAILURE')
        } else if (resp.status == 200) {
          context.dispatch('SAVE_FLASH_SUCCESS', 'Zapisano.')
          context.dispatch('VOLUNTEER_REMOVEDATA_SUCCESS')

          //podwójne navigateAction aby odświeżyć avatar
          context.executeAction(navigateAction, {url: '/wolontariusz/'+payload.id})
            .then(function () {
              context.executeAction(navigateAction, {url: '/wolontariusz/'+payload.id+'/admin'})  
            })
                
          //context.executeAction(navigateAction, {url: '/'})
          //timeout(function () {
          //  context.executeAction(navigateAction, {url: '/wolontariusz/'+payload.id+'/admin'})
          //}, 3000)
          //context.executeAction(navigateAction, {url: '/wolontariusz/'+payload.id+'/admin'})
        } else {
          context.dispatch('SAVE_FLASH_FAILURE', 'Wystąpił nieznany błąd 2')
          context.dispatch('VOLUNTEER_REMOVEDATA_FAILURE')
        }
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
      if(err) {
        debug(err)
      } else if(!data) {
        debug('Błąd ładowania aktywności')
      } else {
        context.dispatch('LOAD_ACTIVITY', data)
        context.dispatch('LOAD_NEWS_PAGE', payload.page)
      }
      cb(data)
    })
  },

  loadActivities: function(context, state, cb) {

    var must = []
    var must_not = []

    var finishedQuery = {
      or: [
        {
          term: {
            'doc.is_archived': true
          }
        },
        {
          range: {
            'doc.datetime': {
              'lte': 'now'
            }
          }
        }
      ]
    }

    var availableQuery = {
      term: {
        'doc.limit_reached': true
      }
    }

    //Jeżeli otwarta jest zakładka Bank Pracy, Biorę Udział w w to potrzeba zwrócić trwające i wolne zadania
    //a w zakładce Moje Zadania zwracamy wszystkie lub wybrane

    if(!state.created_by) {
      must_not.push(finishedQuery)
      must_not.push(availableQuery)
    } else {
      if(state.timeState == 'trwajace') {
        must_not.push(finishedQuery)
      } else if (state.timeState == 'zakonczone') {
        must.push(finishedQuery)
      }

      if(state.availabilityState == 'wolne') {
        must_not.push(availableQuery)
      } else if (state.availabilityState == 'pelne') {
        must.push(availableQuery)
      }
    }

    if(state.created_by) {
      must.push({
        term: { 'doc.created_by': state.created_by }
      })
    }

    if(state.volunteer) {
      must.push({
        term: { 'doc.volunteers': state.volunteer }
      })
    }

    if(state.act_type) {
      must.push({
        term: { 'doc.act_type': state.act_type }
      })
    }

    if(state.priority) {
      if (state.priority === 'PILNE') {
        must.push({
          term: { 'doc.is_urgent': true }
        })
      } else {
        must_not.push({
          term: { 'doc.is_urgent': true }
        })
      }
    }

    //geo_point w elastic search ma współrzędne [LON, LAT] w przeciwieństwie do [LAT, LON]
    //nowe pole tworzone jest za pomocą logstash
    if(state.placeDistance) {
      must.push({
        'geo_distance': {
          'distance': state.placeDistance+'km',
          'doc.lon_lat': [parseFloat(state.placeLon), parseFloat(state.placeLat)]
        }
      })
    }

    if(state.tags && state.tags.length) {
      must.push({
        terms: { 'doc.tags': state.tags }
      })
    }

    var query = {
      nested: {
        path: 'doc',
        query: {
          bool: {
            must: must,
            must_not: must_not
          }
        }
      }
    }

    var params = {
      query : query
    }

    var payload = {
      query: params,
      config: {
        size: 50
      }
    }

    // Pobiera zadania z elastic searcha
    context.service.create('ActivitiesES', payload.config, payload.query, function (err, data) {
      if(err) { debug(err) }
      else {
        context.dispatch('LOAD_ACTIVITIES', {
          all: data,
          query: state
        })
      }
      cb(err, data)
    })
  },

  updateActivity: function(context, payload, cb) {
    context.service.update('Activities', {}, payload, function (err, data) {
      if(err) { debug(err) }
      else {
        //var change = data.changes[0]
        //if(change) {
        // TODO tymczasowe rozwiązanie

        var Draft = require('draft-js')
        var contentState = Draft.convertFromRaw(payload.description)
        payload.description = Draft.EditorState.createWithContent(contentState)

        context.dispatch('ACTIVITY_UPDATED', payload)
        context.executeAction(navigateAction, {url: '/zadania/'+payload.id})
      }
      cb()
    })
  },

  postActivityUpdate: function(context, payload, cb) {
    context.service.update('Activities', {}, payload, function (err, data) {
      if(err) { debug(err) }
      else {
        context.dispatch('SAVE_FLASH_SUCCESS', 'Aktualizacja do zadania została pomyślnie opublikowana.')
        context.dispatch('UPDATE_ADDED', payload.updates)
        cb()
      }
    })
  },

  joinActivity: function(context, payload, cb) {
    context.service.create('Joints', {}, payload, function (err, data) {
      if (err) { // Błąd po stronie serwera
        context.dispatch('SAVE_FLASH_FAILURE', 'Wystąpił nieznany błąd')
      } else {
        context.dispatch('SAVE_FLASH_SUCCESS', 'Dziękujemy za zgłoszenie!')
        var user = context.getUser()
        context.dispatch('JOINT_CREATED', Object.assign({}, user, {
          id: data.changes[0].new_val.id,
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
          context.executeAction(navigateAction, {url: '/zadania/'+id})
          cb()
        })
      }
    })
  },

  postNewsCreate: function(context, payload, cb) {
    context.service.update('Activities', payload, {}, function (err, data) {
      if(err) { debug(err) }
      else {
        context.dispatch('SAVE_FLASH_SUCCESS', 'Aktualność została pomyślnie opublikowana.')
        context.executeAction(navigateAction, {url: '/aktualnosci'})
        cb()
      }
    })
  },
  postNewsEdit: function(context, payload, cb) {
    context.service.update('Activities', payload, {}, function (err, data) {
      if(err) { debug(err) }
      else {
        context.dispatch('SAVE_FLASH_SUCCESS', 'Aktualność została pomyślnie wyedytowana.')
        context.dispatch('NEWS_CHANGED', data)
        cb()
      }
    })
  },
  postNewsRemove: function(context, payload, cb) {
    context.service.update('Activities', payload, {}, function (err, data) {
      if(err) { debug(err) }
      else {
        context.dispatch('SAVE_FLASH_SUCCESS', 'Aktualność została pomyślnie usunięta.')
        if (payload.goToPreviousPage) {
          context.executeAction(navigateAction, {url: '/aktualnosci;page='+(payload.page-1)})
        } else {
          context.executeAction(navigateAction, {url: '/aktualnosci;page='+payload.page})
        }    
        cb()
      }
    })
  },

  createComment: function(context, payload, cb) {
    debug('profile comment create')
    context.service.create('Comments', payload, {}, function (err, data) {
      if(err) {
        debug(err)
      } else {
        context.dispatch('SAVE_FLASH_SUCCESS', 'Komentarz został pomyślnie dodany.')
        context.dispatch('COMMENT_CREATED', data)
      }
      cb()
    })
  },

  updateComment: function(context, payload, cb) {
    debug('profile comment update')
    context.service.update('Comments', {isSafeToBeExecuted: true}, payload, function (err) {
      if(err) { debug(err) }
      else { context.dispatch('COMMENT_UPDATED', payload) }
      cb()
    })
  },

  deleteComment: function(context, payload, cb) {
    debug('profile comment delete')
    payload.isSafeToBeExecuted = true
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

        context.service.read('Volunteers', {id: payload.user_id}, {},
          function (err, data) {
            if (err) { debug(err) }
            else { context.dispatch('LOAD_VOLUNTEER', data) }
            cb()
          }
        )
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

  // Koordynator wyraził zgodę na warunki użytkowania
  adminConsent: function(context) {
    context.dispatch('ADMIN_CONSENT')
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
          fields: ['doc.first_name', 'doc.last_name']
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

    if(state['raw.need_accomodation']) {
      raw_must.push({
        term: { 'raw.cd_need_accomodation': true }
      })
    }
    //else {
    //  raw_must.push({
    //    term: { 'raw.cd_need_accomodation': false }
    //  })
    //}
    
    if(state.mobilephone) {
      raw_must.push({
        term: { 'raw.rg_mobilephone': state.mobilephone }
      })
    }

    if(state.city) {
      raw_should.push({
        match: { 'raw.rg_city': state.city }
      })
    }

    if(state.sectors) {
      raw_should.push({
        match: { 'raw.cd_sectors': state.sectors }
      })
    }

    if(state.skills) {
      raw_should.push({
        or: [
          { match: { 'raw.sk_skills': state.skills }},
          { match: { 'raw.sk_other_skills': state.skills } }
        ]

      })
    }

    if(state.languages) {
      var languages = state.languages
      for (var i=0; i<languages.length; i++) {
        var name = languages[i].split('_')[0]
        var level = languages[i].split('_')[1]

        var terms = function () {
          switch (level) {
          case 'basic':
            return [
                {'term': {'raw.od_motherlanguage': {'value': name, 'boost': 10 } } },
                {'term': {'raw.od_languages': {'value': name+'=professional translator, interpreter', 'boost': 8 } } },
                {'term': {'raw.od_languages': {'value': name+'=excellent', 'boost': 6 } } },
                {'term': {'raw.od_languages': {'value': name+'=good', 'boost': 4 } } },
                {'term': {'raw.od_languages': {'value': name+'=basic', 'boost': 2 } } }
            ]
          case 'good':
            return [
                {'term': {'raw.od_motherlanguage': {'value': name, 'boost': 10 } } },
                {'term': {'raw.od_languages': {'value': name+'=professional translator, interpreter', 'boost': 8 } } },
                {'term': {'raw.od_languages': {'value': name+'=excellent', 'boost': 6 } } },
                {'term': {'raw.od_languages': {'value': name+'=good', 'boost': 4 } } }
            ]
          case 'excellent':
            return [
                {'term': {'raw.od_motherlanguage': {'value': name, 'boost': 10 } } },
                {'term': {'raw.od_languages': {'value': name+'=professional translator, interpreter', 'boost': 8 } } },
                {'term': {'raw.od_languages': {'value': name+'=excellent', 'boost': 6 } } }
            ]
          case 'interpreter':
            return [
                {'term': {'raw.od_motherlanguage': {'value': name, 'boost': 10} } },
                {'term': {'raw.od_languages': {'value': name+'=professional translator, interpreter', 'boost': 8 } } }
            ]
          default:
            return [
                {'term': {'raw.od_motherlanguage': {'value': name, 'boost': 10} } }
            ]
          }
        }()
        raw_must.push({
          or: terms
        })
      }
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
  },

  inviteUser: function(context, user) {
    var query = {id: user.id}
    var request = new XMLHttpRequest()
    request.open('POST', '/invitation', true)
    request.setRequestHeader('Content-Type', 'application/json')
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        context.dispatch('INVITATION_SEND')
      //} else {
      // We reached our target server, but it returned an error
      }
    }

    request.onerror = function() {
      // There was a connection error of some sort
    }

    request.send(JSON.stringify(query))
  },

  activateAccount: function(context, state) {
    var query = { email: state.email }
    var request = new XMLHttpRequest()

    request.open('POST', '/register', true)
    request.setRequestHeader('Content-Type', 'application/json')
    request.onload = function() {
      var json = JSON.parse(request.responseText)
      context.dispatch('LOAD_ACCOUNT_ACTIVATION_MESSAGE', {
        email: state.email,
        message: json.message
      })
    }

    request.onerror = function() {
      // There was a connection error of some sort
    }

    request.send(JSON.stringify(query))
  },

  setInstagram: function(context, data) {
    request
      .post('/instagram')
      .send({ username: data.instagram.username })
      .end(function(err, resp){
        if(err) {
          context.dispatch('SAVE_FLASH_FAILURE', 'Błąd: Podany użytkownik nie został znaleziony.')
        } else if (resp.body.result) {
          context.dispatch('LOAD_VOLUNTEER', data)
        } else {
          context.dispatch('SAVE_FLASH_FAILURE', 'Wystąpił nieznany błąd.')
        }
      })
  }
}
