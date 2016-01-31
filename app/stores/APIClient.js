'use strict'
var createStore  = require('fluxible/addons').createStore

var APIClients = createStore({
  storeName: 'APIClientStore',
  handlers: {
    'APICLIENT_CREATION_SUCCESS': 'onSuccess',
    'APICLIENT_CREATION_FAILURE': 'onFailure'
  },

  onFailure: function() {
    this.error = true
    this.success = null
    this.emitChange()
  },

  onSuccess: function() {
    this.error = null
    this.success = true
    this.emitChange()
  }
})

APIClients.attributes = function() {
  return [
    'id',
    'name',
    'callback_url',
    'image'
  ]
}

module.exports = APIClients
