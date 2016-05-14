'use strict'
var createStore  = require('fluxible/addons').createStore

var XlsStore = createStore({
  storeName: 'Xls',

  handlers: {
    'LOAD_XLS': 'load'
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

module.exports = XlsStore
