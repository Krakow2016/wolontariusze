'use strict';
var createStore  = require('fluxible/addons').createStore;
var Volonteer = require('./Volonteer')

var VolonteersStore = createStore({
    storeName: 'VolonteersStore',
    handlers: {
        'LOAD_VOLONTEERS' : 'loadAll',
    },

    loadAll: function(data) {
        this.all = data
        this.emitChange();
    },

    getAll: function () {
        return {
            all: this.all
        }
    },

    initialize: function () {
        this.all = [];
    },

    dehydrate: function () {
        return {
            all: this.all
        }
    },

    rehydrate: function (state) {
        this.all = state.all;
    }
});

VolonteersStore.model = Volonteer

module.exports = VolonteersStore;
