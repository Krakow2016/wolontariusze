'use strict';
var createStore  = require('fluxible/addons').createStore
var APIClient = require('./APIClient')

var APIClients = createStore({
    storeName: 'APIClientsStore',
    handlers: {
      'LOAD_APICLIENTS': 'load'
    },

    load: function(data) {
      this.api_clients = data
      this.emitChange()
    },

    getState: function() {
      return {
        api_clients: this.api_clients || []
      }
    },

    dehydrate: function () {
      return this.getState()
    },

    rehydrate: function (state) {
      this.api_clients = state.api_clients
    }
})

APIClients.model = APIClient

module.exports = APIClients
