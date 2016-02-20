
'use strict'
var createStore  = require('fluxible/addons').createStore

var ActivityStore = createStore({
  storeName: 'Activity',
  handlers: {
    'LOAD_ACTIVITY': 'load',
    'PRECREATE_ACTIVITY': 'precreate',
    'ACTIVITY_UPDATED': 'update',
    'JOINT_CREATED': 'join',
    'JOINT_DELETED': 'leave',
    'ACTIVITY_TAG_CREATED': 'tag_created',
    'ACTIVITY_TAG_DELETED': 'tag_deleted'
  },

  initialize: function () {
    this.activity = {
      name: '',
      type: '',
      datetime: '',
      duration: '',
      place: '',
      description: '',
      maxVolunteers: 5
    }
    this.volunteers = []
    this.invalidSnackBar = ''
    this.tags = []
  },

  load: function(data) {
    var volunteers = data.volunteers || []
    var tags = data.tags || []
    delete data.volunteers
    delete data.tags
    this.activity = data
    this.volunteers = volunteers
    this.tags = tags
    this.emitChange()
  },

  precreate: function() {
    this.initialize()
    this.emitChange()
  },

  join: function(joint) {
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
  
  tag_created: function(joint) {
    this.tags.push(joint)
    this.emitChange()
  },

  tag_deleted: function(id) {
    // Usuń obiekt połączenia
    this.tags = this.tags.filter(function(tag) {
      return tag.id !== id
    })
    this.emitChange()
  },
  

  create: function(data) {
    // TODO
    //this.rehydrate(data)
    this.emitChange()
  },


  update: function(data) {
    this.activity = data
    this.emitChange()
  },

  getState: function () {
    return {
      activity: this.activity,
      volunteers: this.volunteers,
      invalidSnackBar: this.invalidSnackBar,
      tags: this.tags
    }
  },

  dehydrate: function () {
    return this.getState()
  },

  rehydrate: function (state) {
    this.activity = state.activity
    this.volunteers = state.volunteers
    this.invalidSnackBar = state.invalidSnackBar
    this.tags = state.tags
  }

})

ActivityStore.attributes = function() {
  return [
    'id',
    'name',
    'title',
    'type',
    'description',
    'created_at',
    'updated_at',
    'datetime',
    'duration',
    'place',
    'is_archived',
    'is_urgent',
    'creator',
    'editor',
    'maxVolunteers',
    'volunteers',
    'lat_lon'
    'volunteerNumber',
    'tags'
  ]
}

module.exports = ActivityStore
