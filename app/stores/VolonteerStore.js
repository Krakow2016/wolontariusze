'use strict';
var createStore  = require('fluxible/addons').createStore;
var routesConfig = require('../pages/volonteer/routes')

var VolonteerStore = createStore({
    storeName: 'VolonteerStore',
    handlers: {
        'LOAD_VOLONTEER'       : 'load'
    },

    initialize: function () {
        this.name = '?'
    },

    load: function(data) {
        console.log('>>> LOAD VOLONTEER <<<====')
        this.name = data.name
        this.emitChange();
    },

    getState: function () {
        return {
            name: this.name
        };
    },

    dehydrate: function () {
        return this.getState();
    },

    rehydrate: function (state) {
        this.name = state.name;
    }
});


module.exports = VolonteerStore;
