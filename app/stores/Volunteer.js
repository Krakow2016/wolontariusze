'use strict'
var createStore  = require('fluxible/addons').createStore

var VolunteerStore = createStore({
  storeName: 'Volunteers',
  handlers: {
    'LOAD_VOLUNTEER'  : 'load',
    'VOLUNTEER_CREATION_FAILURE': 'onFailure',
    //'VOLUNTEER_CREATION_SUCCESS': 'onSuccess',
    'VOLUNTEER_UPDATE_FAILURE': 'onFailure',
    'VOLUNTEER_UPDATE_SUCCESS': 'onSuccess',
    'INVITATION_SEND': 'onInvited'
  },

  initialize: function () {
    this.profile = {}
  },

  load: function(data) {
    this.profile = data
    this.emitChange()
  },

  createVolunteer: function(volunteer) {
    return volunteer
  },

  onFailure: function() {
    this.error = true
    this.success = null
    this.emitChange()
  },

  onSuccess: function(data) {
    this.error = null
    this.success = true
    // Zaaplikuj wprowadzone zmiany do interface-u
    Object.assign(this.profile, data)
    this.emitChange()
  },

  onInvited: function() {
    this.profile = Object.assign({}, this.profile, {approved: true})
    this.emitChange()
  },

  getState: function () {
    var state = {
      profile: this.profile,
      error: this.error,
      success: this.success
    }

    // Domyślna wartość TODO czy nie da się inaczej?
    if(!state.profile.profile_picture_url) {
      state.profile.profile_picture_url = '/img/profile/face.svg'
    }

    return state
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
    this.profile = state.profile
  }
})

// Atrubyty do odczytu przez wszystkich
VolunteerStore.attributes = function() {
  return [
    'id',
    'first_name',
    'last_name',
    'nationality',
    'profile_picture_url',
    'tags',
    'thumb_picture_url',
    'who_question',
    'what_question',
    'why_question',
    'profile_visible'
  ]
}

module.exports = VolunteerStore
