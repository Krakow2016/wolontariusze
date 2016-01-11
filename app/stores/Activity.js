'use strict'
var createStore  = require('fluxible/addons').createStore

var ActivityStore = createStore({
  storeName: 'Activity',
  handlers: {
    'LOAD_ACTIVITY': 'load',
    'ACTIVITY_UPDATED': 'update',
    'ACTIVITY_CREATED': 'create'
  },

  initialize: function () {
    this.activity = {
      content: '',
      maxVolonteers: 5,
      volunteers: []
    }
  },

  load: function(data) {
    this.activity = data
    this.emitChange()
  },

  update: function(data) {
    this.activity = data
    this.emitChange()
  },

  create: function(data) {
    // TODO
    //this.rehydrate(data)
    this.emitChange()
  },

  getState: function () {
    return {
      activity: this.activity
    }
  },

  dehydrate: function () {
    return this.getState()
  },

  rehydrate: function (state) {
    this.activity = state.activity
  }

})

ActivityStore.attributes = function() {
  return [
    'id',
    'title',
    'content',
    'creationTimestamp',
    'editionTimestamp',
    'startEventTimestamp',
    'duration',
    'place',
    'is_urgent',
    'creator',
    'editor',
    'maxVolonteers',
    'activeVolonteers',
    'volonteersLimit'
  ]
}

module.exports = ActivityStore
