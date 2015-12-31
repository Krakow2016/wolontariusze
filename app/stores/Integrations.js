'use strict';
var createStore  = require('fluxible/addons').createStore

var IntegrationsStore = createStore({
    storeName: 'IntegrationsStore',
    handlers: {
      'LOAD_INTEGRATIONS': 'load'
    },

    load: function(data) {
      this.integrations = data
      this.emitChange()
    },

    getState: function() {
      return {
        integrations: this.integrations || []
      }
    },

    dehydrate: function () {
      return this.getState()
    },

    rehydrate: function (state) {
      this.integrations = state.integrations
    }
})

IntegrationsStore.model = {
  attributes: function() {
    return [
      'id',
      'name'
    ]
  }
}

module.exports = IntegrationsStore
