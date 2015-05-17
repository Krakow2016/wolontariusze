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

    load: function(data) {
        console.log('>>> LOAD VOLONTEER <<<====')
        this.first_name = data.first_name
        this.last_name  = data.last_name
        this.city       = data.city
        this.emitChange();
    },

    getState: function () {
        return {
            first_name: this.first_name,
            last_name: this.last_name,
            city: this.city
        };
    },

    dehydrate: function () {
        return this.getState();
    },

    rehydrate: function (state) {
        this.first_name = state.first_name
        this.last_name  = state.last_name
        this.city       = state.city
    }
});


module.exports = VolonteerStore;
