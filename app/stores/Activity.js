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
    storeName: 'Activity',
    handlers: {
        'LOAD_ACTIVITY'       : 'load',
        'NEW_ACTIVITY'        : 'preCreate',  //do czyszczenia danych przy tworzeniu nowej aktywności
        'ACTIVITY_UPDATED': 'update',
        'ACTIVITY_CREATED': 'create'
    },

    initialize: function () {
        this.state = {
            id: 0,
            visibilityIds: [],
            activeVolonteersIds: [],
            points: 10,
            maxVolonteers: 5,
        };
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
    preCreate: function () {
        this.initialize();
        this.emitChange();
    },
    create: function(data) {
      console.log('>>> CREATE ACTIVITY <<<====')
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

ActivityStore.attributes = function() {
  return [
    'id',
    'title',
    'content',
    'creationTimestamp',
    'editionTimestamp',
    'startEventTimestamp',
    'duration',
    'place',
    'creatorId',
    'editorId',
    'maxVolonteers',
    'activeVolonteersIds',
    'creatorName',
    'editorName',
    'activeVolonteers',
    'volonteersLimit'
  ]
}

module.exports = ActivityStore;
