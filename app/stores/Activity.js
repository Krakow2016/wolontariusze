'use strict'

var createStore  = require('fluxible/addons').createStore
var Draft = require('draft-js')
var fromJS = require('immutable').fromJS
var _ = require('lodash')

var ActivityStore = createStore({
  storeName: 'Activity',
  handlers: {
    'LOAD_ACTIVITY': 'load',
    'PRECREATE_ACTIVITY': 'precreate',
    'ACTIVITY_UPDATED': 'update',
    'JOINT_CREATED': 'join',
    'JOINT_DELETED': 'leave',
    'UPDATE_ADDED': 'update_published'
  },

  initialize: function () {
    this.activity = {
      name: '',
      act_type: 'niezdefiniowany',
      place: '',
      is_urgent: false,
      limit: 0
    }
    this.volunteers = []
    this.activityState = Draft.EditorState.createEmpty()
    this.newUpdateState = Draft.EditorState.createEmpty()
    this.updates = []
  },

  load: function(data) {
    var that = this
    var volunteers = data.volunteers || []
    delete data.volunteers
    this.activity = data
    this.volunteers = volunteers

    _.forEach(data.description.entityMap, function(val, key) {
      val.data.mention = fromJS(val.data.mention)
    })

    // Opis zadania
    var contentState = Draft.convertFromRaw(data.description)
    this.activityState = Draft.EditorState.push(this.activityState, Draft.ContentState.createFromBlockArray(contentState.getBlocksAsArray()))

    // Aktualizacje
    this.updates = data.updates

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

  create: function(data) {
    // TODO
    //this.rehydrate(data)
    this.emitChange()
  },

  update: function(data) {
    Object.assign(this.activity, data)
    this.emitChange()
  },

  update_published: function(updates) {
    this.updates = updates
    this.newUpdateState = Draft.EditorState.createEmpty()
    this.emitChange()
  },

  getState: function () {
    return {
      activity: this.activity,
      activityState: this.activityState,
      volunteers: this.volunteers,
      updates: this.updates,
      newUpdateState: this.newUpdateState
    }
  },

  dehydrate: function () {
    return {
      activity: this.activity,
      volunteers: this.volunteers,
      activityState: Draft.convertToRaw(this.activityState.getCurrentContent()),
      newUpdateState: Draft.convertToRaw(this.newUpdateState.getCurrentContent()),
      updates: this.updates
    }
  },

  rehydrate: function (state) {
    this.activity = state.activity
    this.volunteers = state.volunteers
    this.updates = state.updates

    _.forEach(state.activityState.entityMap, function(val, key) {
      val.data.mention = fromJS(val.data.mention)
    })

    var contentState = Draft.convertFromRaw(state.activityState)
    this.activityState = Draft.EditorState.push(this.activityState, Draft.ContentState.createFromBlockArray(contentState.getBlocksAsArray()))

    // Formularz aktualizacji do zadania
    var contentState2 = Draft.convertFromRaw(state.newUpdateState)
    this.newUpdateState = Draft.EditorState.push(this.newUpdateState, Draft.ContentState.createFromBlockArray(contentState2.getBlocksAsArray()))
  }

})

ActivityStore.attributes = function() {
  return [
    'id',
    'act_type',
    'created_at',
    'created_by',
    'datetime',
    'description',
    'endtime',
    'is_archived',
    'is_private',
    'is_urgent',
    'lat_lon',
    'limit',
    'name',
    'place',
    'starts_at',
    'tags',
    'updated_at',
    'updates',
    'volunteers',
    // dane autora (pochodzą z joina)
    'first_name',
    'last_name',
    'profile_picture_url'
  ]
}

module.exports = ActivityStore
