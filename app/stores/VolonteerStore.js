'use strict';
var createStore  = require('fluxible/addons').createStore;
var routesConfig = require('../pages/volonteer/routes')

var VolonteerStore = createStore({
    storeName: 'VolonteerStore',
    handlers: {
        'LOAD_VOLONTEER'       : 'load'
    },

    initialize: function () {
        //
    },

    attributes: [
      'first_name',
      'last_name',
      'city',
      'profile_picture',
      'background_picture',
      'interests',
      'departments',
      'my_dream'
    ],

    load: function(data) {
      console.log('>>> LOAD VOLONTEER <<<====')
      this.rehydrate(data)
      this.emitChange();
    },

    getState: function () {
      var state = {}
      this.attributes.forEach(function(attr) {
        state[attr] = this[attr]
      }, this)
      return state
    },

    dehydrate: function () {
        return this.getState();
    },

    rehydrate: function (state) {
      this.attributes.forEach(function(attr) {
        this[attr] = state[attr]
      }, this)
    }
});


module.exports = VolonteerStore;
