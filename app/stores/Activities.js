'use strict'
var createStore  = require('fluxible/addons').createStore
var Activity = require('./Activity')

var ActivitiesStore = createStore({
  storeName: 'Activities',
  handlers: {
    'LOAD_ACTIVITIES' : 'loadAll',
    'LOAD_ACTIVITIES_QUERY': 'loadQuery'
  },

  initialize: function () {
    this.all = []
    this.query = {}
  },

  loadAll: function(data) {
    this.all = data.all
    this.query = data.query
    this.emitChange()
  },

  loadQuery: function(data) {
    this.query = data
    this.emitChange()
  },

  dehydrate: function () {
    return {
      all: this.all,
      query: this.query
    }
  },

  rehydrate: function (state) {
    this.all = state.all
    this.query = state.query
  }
})

ActivitiesStore.model = Activity

module.exports = ActivitiesStore
