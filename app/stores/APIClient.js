'use strict';
var createStore  = require('fluxible/addons').createStore

var APIClients = createStore({
    storeName: 'APIClientStore',
    handlers: {
      'APICLIENT_CREATION_SUCCESS': 'onCreated'
    },

    onCreated: function() {
      // TODO: wyświetl komunikat o udanym dodaniu klienta API
    }
})

APIClients.attributes = function() {
  return [
    'id',
    'name',
    'image',
    'client_secret',
    'callback_url'
  ]
}

module.exports = APIClients
