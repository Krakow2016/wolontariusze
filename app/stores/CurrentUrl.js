'use strict'
var createStore  = require('fluxible/addons').createStore

var CurrentUrlStore = createStore({
  storeName: 'CurrentUrl',

  handlers: {
    'LOAD_URL': 'load'
  },

  load: function(data) {
    this.url = data
    this.emitChange()
  },

  dehydrate: function () {
    return {
      url: this.url
    }
  },

  rehydrate: function (state) {
    this.url = state.url
  },

getState: function () {
    return {
      url: this.url,
    }
  },
})

module.exports = CurrentUrlStore
