'use strict'
var createStore  = require('fluxible/addons').createStore

var Results = createStore({
  storeName: 'ResultsStore',
  handlers: {
    'LOAD_RESULTS': 'loadAll',
    'LOAD_QUERY': 'loadQuery'
  },

  initialize: function () {
    this.all = []
    this.query = {}
  },

  loadAll: function(data) {
    this.all = data.hits.hits
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

module.exports = Results
