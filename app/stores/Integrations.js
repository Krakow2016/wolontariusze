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
    }
})

IntegrationsStore.attributes = function() {
  return [
    'id',
    'name'
  ]
}

module.exports = IntegrationsStore
