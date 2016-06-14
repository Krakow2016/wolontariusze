'use strict'
var createStore  = require('fluxible/addons').createStore
var NewComment = require('./NewComment')

var Comments = createStore({
  storeName: 'Comments',
  handlers: {
    'LOAD_COMMENTS': 'load',
    'COMMENT_CREATED': 'add',
    'COMMENT_DELETED': 'remove',
    'COMMENT_UPDATED': 'update'
  },

  initialize: function () {
    this.comments = []
  },

  load: function(data) {
    this.comments = data
    this.emitChange()
  },

  add: function(comments) {
    var that = this
    comments.forEach(function(comment){
      that.comments.unshift(comment)
    })
    this.emitChange()
  },

  remove: function(comment) {
    var position = this.comments.indexOf(comment)
    this.comments.splice(position, 1)
    this.emitChange()
  },

  update: function(comment) {
    var index = this.comments.findIndex(function(c) {
      return c.id === comment.id
    })
    var comments = this.comments.slice()
    comments[index] = comment

    if(index > -1) {
      this.comments = comments
      this.emitChange()
    }
  },

  getState: function() {
    return {
      comments: this.comments || []
    }
  },

  // Returns a serializable object containing the state of the Fluxible and
  // passed FluxibleContext instances. This is useful for serializing the
  // state of the application to send it to the client.
  dehydrate: function () {
    return this.getState()
  },

  // Takes an object representing the state of the Fluxible and
  // FluxibleContext instances (usually retrieved from dehydrate) to
  // rehydrate them to the same state as they were on the server
  rehydrate: function (state) {
    this.comments = state.comments
  }
})

Comments.model = NewComment

// Oznacz wszystkie atrybuty jako dostępne tylko dla administratorów
Comments.attributes = function() {
  return []
}

module.exports = Comments
