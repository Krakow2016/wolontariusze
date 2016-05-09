'use strict'
var createStore  = require('fluxible/addons').createStore

var AccountActivationStore = createStore({
  storeName: 'AccountActivation',

  handlers: {
    'LOAD_ACCOUNT_ACTIVATION_MESSAGE': 'load'
  },

  load: function(data) {
    this.data = data
    this.emitChange()
  },

  dehydrate: function () {
    return {
      data: this.data
    }
  },

  rehydrate: function (state) {
    this.data = state.data
  }
})

module.exports = AccountActivationStore