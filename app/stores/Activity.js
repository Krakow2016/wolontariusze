'use strict';
var createStore  = require('fluxible/addons').createStore;

var ActivityStore = createStore({
  storeName: 'Activity',
  handlers: {
    'LOAD_ACTIVITY': 'load',
    'ACTIVITY_UPDATED': 'update',
    'JOINT_CREATED': 'join',
    'JOINT_DELETED': 'leave',
  },

  initialize: function () {
    this.activity = {}
    this.volunteers = []
  },

  load: function(data) {
    console.log('>>> LOAD ACTIVITY <<<====')
    var volunteers = data.volunteers || []
    delete data.volunteers
    this.activity = data
    this.volunteers = volunteers
    this.emitChange()
  },

  join: function(joint) {
    // Dodaj obiekt połączenia
    this.volunteers.push(joint)
    this.emitChange()
  },

  leave: function(id) {
    // Usuń obiekt połączenia
    this.volunteers = this.volunteers.filter(function(volunteer) {
      return volunteer.id !== id
    })
    this.emitChange()
  },

  update: function(data) {
    console.log('>>> UPDATE ACTIVITY <<<====')
    this.activity = data
    this.emitChange()
  },

  getState: function () {
    return {
      activity: this.activity,
      volunteers: this.volunteers
    }
  },

  dehydrate: function () {
    return this.getState()
  },

  rehydrate: function (state) {
    this.activity = state.activity
    this.volunteers = state.volunteers
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
