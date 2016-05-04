'use strict'

var createStore  = require('fluxible/addons').createStore
var Draft = require('draft-js')
var TimeService = require('../modules/time/TimeService.js')
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
      datetime: TimeService.NO_DATE,
      endtime: TimeService.NO_DATE,
      is_urgent: false,
      limit: 5,
      profile_picture_url: '/img/profile/face.svg'
    }
    this.volunteers = []
    this.invalidDatetime = ''
    this.invalidEndtime = ''
    this.activityDescription = Draft.EditorState.createEmpty()
    this.editorState = Draft.EditorState.createEmpty()
  },

  load: function(data) {
    var volunteers = data.volunteers || []
    delete data.volunteers
    this.activity = data
    this.volunteers = volunteers

    _.forEach(data.description.entityMap, function(val, key) {
      val.data.mention = fromJS(val.data.mention)
    })

    var contentState = Draft.convertFromRaw(data.description)
    var editorState = Draft.EditorState.push(this.activityDescription, Draft.ContentState.createFromBlockArray(contentState.getBlocksAsArray()))
    this.activityDescription = editorState
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
    this.activity.updates = updates
    this.editorState = Draft.EditorState.createEmpty()
    this.emitChange()
  },

  getState: function () {
    return {
      activity: this.activity,
      activityDescription: this.activityDescription,
      volunteers: this.volunteers,
      invalidDatetime: this.invalidDatetime,
      invalidEndtime: this.invalidEndtime,
      editorState: this.editorState
    }
  },

  dehydrate: function () {
    return {
      activity: this.activity,
      activityDescription: Draft.convertToRaw(this.activityDescription.getCurrentContent()),
      volunteers: this.volunteers,
      invalidDatetime: this.invalidDatetime,
      invalidEndtime: this.invalidEndtime,
      editorState: Draft.convertToRaw(this.editorState.getCurrentContent())
    }
  },

  rehydrate: function (state) {
    this.activity = state.activity
    this.volunteers = state.volunteers
    this.invalidDatetime = state.invalidDatetime
    this.invalidEndtime = state.invalidEndtime

    _.forEach(state.activityDescription.entityMap, function(val, key) {
      val.data.mention = fromJS(val.data.mention)
    })

    var contentState = Draft.convertFromRaw(state.activityDescription)
    this.activityDescription = Draft.EditorState.push(this.activityDescription, Draft.ContentState.createFromBlockArray(contentState.getBlocksAsArray()))

    // Formularz aktualizacji do zadania
    _.forEach(state.editorState.entityMap, function(val, key) {
      val.data.mention = fromJS(val.data.mention)
    })

    var contentState2 = Draft.convertFromRaw(state.editorState)
    this.editorState = Draft.EditorState.createWithContent(contentState2)
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
