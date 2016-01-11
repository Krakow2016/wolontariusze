'use strict'
var createStore  = require('fluxible/addons').createStore
var Activity = require('./Activity')

var ActivitiesStore = createStore({
  storeName: 'Activities',
  handlers: {
    'LOAD_ACTIVITIES' : 'loadAll',
    'ACTIVITY_DELETED': 'delete'
  },

  loadAll: function(data) {
    this.all = data
    this.emitChange()
  },
  
  delete: function (data) {
    this.all =  data
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

ActivitiesStore.model = Activity

// Oznacz wszystkie atrybuty jako dostępne tylko dla administratorów
//ActivitiesStore.attributes = function() {
//  return []
//}


module.exports = ActivitiesStore
