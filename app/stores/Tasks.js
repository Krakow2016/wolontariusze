'use strict'
var createStore  = require('fluxible/addons').createStore
var Activity = require('./Activity')

var TasksStore = createStore({
  storeName: 'Tasks',
  handlers: {
    'LOAD_TASKS' : 'loadAll'
  },

  loadAll: function(data) {
    this.data = data
    this.page = 1
    this.emitChange()
  },

  delete: function (data) {
    this.data =  data
    this.emitChange()
  },

  getState: function () {
    return {
      data: this.data || [],
      page: this.page
    }
  },

  initialize: function () {
    this.data = []
    this.page = 1
  },

  dehydrate: function () {
    return {
      data: this.data,
      page: this.page
    }
  },

  rehydrate: function (state) {
    this.data = state.data
    this.page = state.page
  }
})

TasksStore.model = Activity

// Oznacz wszystkie atrybuty jako dostępne tylko dla administratorów
//ActivitiesStore.attributes = function() {
//  return []
//}


module.exports = TasksStore
