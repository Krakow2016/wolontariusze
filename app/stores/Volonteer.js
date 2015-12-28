'use strict';
var createStore  = require('fluxible/addons').createStore

var VolonteerStore = createStore({
    storeName: 'Volonteers',
    handlers: {
      'LOAD_VOLONTEER'  : 'load',
      'VOLONTEER_CREATION_FAILURE': 'onFailure',
      'VOLONTEER_CREATION_SUCCESS': 'onSuccess',
      'VOLONTEER_UPDATE_FAILURE': 'onFailure',
      'VOLONTEER_UPDATE_SUCCESS': 'onSuccess',
      'SHOW_ACCOUNT_SETTINGS': 'trigger_account',
      'SHOW_PROFILE_SETTINGS': 'trigger_profile',
      'SHOW_APPLICATIONS_SETTINGS': 'trigger_applications'
    },

    initialize: function () {
    },

    load: function(data) {
      this.profile = data;
      this.emitChange();
    },

    createVolonteer: function(volonteer) {
      return volonteer
    },

    onFailure: function() {
      this.error = true
      this.success = null
      this.emitChange()
    },

    onSuccess: function() {
      this.error = null
      this.success = true
      this.emitChange()
    },

    trigger_account: function() {
      this.subpage = 'BasicSettings'
      this.emitChange()
    },

    trigger_profile: function() {
      this.subpage = 'InfoSettings'
      this.emitChange()
    },

    trigger_applications: function() {
      this.subpage = 'IntegrationsSettings'
      this.emitChange()
    },

    getState: function () {
      return {
        profile: this.profile || {},
        subpage: this.subpage,
        error: this.error,
        success: this.success
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
      this.profile = state.profile
      this.subpage = state.subpage
    }
});

// Atrubyty do odczytu przez wszystkich
VolonteerStore.attributes = function() {
  return [
    'id',
    'first_name',
    'last_name',
    'email',
    'city',
    'profile_picture',
    'interests',
    'departments',
    'my_dream'
  ]
}

module.exports = VolonteerStore;
