'use strict'
var createStore  = require('fluxible/addons').createStore
var Volunteer = require('./Volunteer')

var VolunteersStore = createStore({
  storeName: 'VolunteersStore',
  handlers: {
    'LOAD_VOLUNTEERS': 'loadAll'
  },

  loadAll: function(data) {
    this.all = data
    this.emitChange()
  },

  getAll: function () {
    return {
      all: this.all
    }
  },

  initialize: function () {
    this.all = []
  },

  dehydrate: function () {
    return {
      all: this.all
    }
  },

  rehydrate: function (state) {
    this.all = state.all
  }
})

VolunteersStore.model = Volunteer

module.exports = VolunteersStore
