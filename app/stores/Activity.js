'use strict';
var createStore  = require('fluxible/addons').createStore;

http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
var cloneState = function (obj) {
    //założenie: activity to obiekt z polami i tablicami (nie ma głębszych obiektów)
    var copy = {};
    for (var attr in obj) {
        if(attr != 'dispatcher') {
            if (obj[attr] instanceof Array) {
                copy[attr] = [];
                for (var i = 0 ; i < obj[attr].length; i++) {
                    copy[attr].push(obj[attr][i]);
                }
            } else {
                copy[attr] = obj[attr];
            }
        }
    }
    return copy;
    
}

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
      var copyState = cloneState(this.state);
      return copyState;
    },

    dehydrate: function () {
        return this.getState();
    },

    rehydrate: function (copyState) {
        this.state = cloneState(copyState);
    }
});


module.exports = ActivityStore;
