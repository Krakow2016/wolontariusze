'use strict'
var createStore  = require('fluxible/addons').createStore

var IndexStore = createStore({
  storeName: 'Index',

  handlers: {
    'LOAD_INDEX': 'load'
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

module.exports = IndexStore
