'use strict';
var createStore  = require('fluxible/addons').createStore;

var ActivityStore = createStore({
    storeName: 'ActivityStore',
    handlers: {
        'LOAD_ACTIVITY'       : 'load',
        'ACTIVITY_UPDATED': 'update'
    },

    initialize: function () {
        this.state = {};
    },

    load: function(data) {
      console.log('>>> LOAD ACTIVITY <<<====')
      this.rehydrate(data)
      this.emitChange();
    },
    
    update: function(data) {
      console.log('>>> UPDATE ACTIVITY <<<====')
      this.rehydrate(data)
      this.emitChange();
    },

    getState: function () {
      return this.state;
    },

    dehydrate: function () {
        return this.getState();
    },

    rehydrate: function (state) {
      this.state = state;
    }
});


module.exports = ActivityStore;
