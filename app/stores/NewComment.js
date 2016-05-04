'use strict'
var createStore  = require('fluxible/addons').createStore
var Draft = require('draft-js')

var NewComment = createStore({
  storeName: 'NewComment',

  initialize: function () {
    this.editorState = Draft.EditorState.createEmpty()
  },

  handlers: {
    'LOAD_VOLUNTEER'  : 'update_volunteer'
  },

  update_volunteer: function(volunteer) {
    this.volunteerId = volunteer.id
    this.emitChange()
  },

  getState: function() {
    return {
      editorState: this.editorState,
      volunteerId: this.volunteerId
    }
  },

  // Returns a serializable object containing the state of the Fluxible and
  // passed FluxibleContext instances. This is useful for serializing the
  // state of the application to send it to the client.
  dehydrate: function () {
    return {
      editorState: Draft.convertToRaw(this.editorState.getCurrentContent()),
      volunteerId: this.volunteerId
    }
  },

  // Takes an object representing the state of the Fluxible and
  // FluxibleContext instances (usually retrieved from dehydrate) to
  // rehydrate them to the same state as they were on the server
  rehydrate: function (state) {
    var contentState = Draft.convertFromRaw(state.editorState)
    this.editorState = Draft.EditorState.createWithContent(contentState)
    this.volunteerId = state.volunteerId
  }
})

// Oznacz wszystkie atrybuty jako dostępne tylko dla administratorów
NewComment.attributes = function() {
  return []
}

module.exports = NewComment
