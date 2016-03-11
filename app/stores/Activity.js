'use strict'

var createStore  = require('fluxible/addons').createStore
var Draft = require('draft-js')

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
      act_type: '',
      duration: '',
      place: '',
      description: Draft.EditorState.createEmpty(),
      limit: 5
    }
    this.volunteers = []
    this.invalidSnackBar = ''
    this.editorState = Draft.EditorState.createEmpty()
  },

  load: function(data) {
    var volunteers = data.volunteers || []
    delete data.volunteers
    this.activity = data
    this.volunteers = volunteers

    var blocks = Draft.convertFromRaw(data.description)
    var contentState = Draft.ContentState.createFromBlockArray(blocks)
    this.activity.description = Draft.EditorState.createWithContent(contentState)

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
      volunteers: this.volunteers,
      invalidSnackBar: this.invalidSnackBar,
      editorState: this.editorState
    }
  },

  dehydrate: function () {

    var activity = Object.assign({}, this.activity, {
      description: Draft.convertToRaw(this.activity.description.getCurrentContent())
    })

    return {
      activity: activity,
      volunteers: this.volunteers,
      invalidSnackBar: this.invalidSnackBar,
      editorState: Draft.convertToRaw(this.editorState.getCurrentContent())
    }
  },

  rehydrate: function (state) {

    this.activity = state.activity
    this.volunteers = state.volunteers
    this.invalidSnackBar = state.invalidSnackBar

    var blocks = Draft.convertFromRaw(this.activity.description)
    var contentState = Draft.ContentState.createFromBlockArray(blocks)
    this.activity.description = Draft.EditorState.createWithContent(contentState)

    var blocks2 = Draft.convertFromRaw(state.editorState)
    var contentState2 = Draft.ContentState.createFromBlockArray(blocks2)
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
    'duration',
    'is_archived',
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
  ]
}

module.exports = ActivityStore
