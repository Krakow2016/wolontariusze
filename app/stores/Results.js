'use strict';
var createStore  = require('fluxible/addons').createStore

var Results = createStore({
    storeName: 'ResultsStore',
    handlers: {
      'LOAD_RESULTS': 'loadAll'
    },

    loadAll: function(data) {
        this.all = data.hits.hits
        this.emitChange()
    },

    initialize: function () {
        this.all = []
    },

    getState: function () {
      return {
        all: this.all
      }
    },

    dehydrate: function () {
        return this.getState()
    },

    rehydrate: function (state) {
        this.all = state.all
    }
})

module.exports = Results
