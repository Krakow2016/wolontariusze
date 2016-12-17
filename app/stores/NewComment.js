'use strict'
var createStore  = require('fluxible/addons').createStore
var Draft = require('draft-js')

var NewComment = createStore({
  storeName: 'NewComment',

  initialize: function () {
    this.editorState = Draft.EditorState.createEmpty()
  },

  handlers: {
    'LOAD_VOLUNTEER'  : 'update_volunteer',
    'LOAD_ACTIVITY'  : 'update_activity'
  },

  update_volunteer: function(volunteer) {
    this.volunteerId = volunteer.id
    this.activityId = null
    this.emitChange()
  },

  update_activity: function(activity) {
    this.volunteerId = null
    this.activityId = activity.id
    this.emitChange()
  },

  getState: function() {
    return {
      editorState: this.editorState,
      volunteerId: this.volunteerId,
      activityId: this.activityId
    }
  },

  // Returns a serializable object containing the state of the Fluxible and
  // passed FluxibleContext instances. This is useful for serializing the
  // state of the application to send it to the client.
  dehydrate: function () {
    return {
      editorState: Draft.convertToRaw(this.editorState.getCurrentContent()),
      volunteerId: this.volunteerId,
      activityId: this.activityId
    }
  },

  // Takes an object representing the state of the Fluxible and
  // FluxibleContext instances (usually retrieved from dehydrate) to
  // rehydrate them to the same state as they were on the server
  rehydrate: function (state) {
    var contentState = Draft.convertFromRaw(state.editorState)
    this.editorState = Draft.EditorState.createWithContent(contentState)
    this.volunteerId = state.volunteerId
    this.activityId = state.activityId
  }
})

NewComment.attributes = function() {
  return [
      'activityId',    
      'adminId',
      'creationTimestamp',
      'id',
      'raw',
      'volunteerId',
      'first_name',
      'last_name',
      'thumb_picture_url'
    ]
}

module.exports = NewComment
