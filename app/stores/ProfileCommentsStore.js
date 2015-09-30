'use strict';
var createStore  = require('fluxible/addons').createStore;

var ProfileCommentsStore = createStore({
    storeName: 'ProfileCommentsStore',
    handlers: {
        'PROFILE_COMMENTS_READ'       : 'load',
        'PROFILE_COMMENTS_CREATE': 'load',
        'PROFILE_COMMENTS_UPDATE': 'load',
        'PROFILE_COMMENTS_DELETE': 'load'
    },

    initialize: function () {
        this.comments = [];
    },

    load: function(data) {
      this.comments = data;
      this.emitChange();
    },
    
    getState: function() {
        return {
            editId: -1,
            comments: this.comments
        };
    },
    getStateWithEdit: function(commentId) {
        return {
            editId: commentId,
            comments: this.comments
        };
    },
     

    // Returns a serializable object containing the state of the Fluxible and
    // passed FluxibleContext instances. This is useful for serializing the
    // state of the application to send it to the client.
    dehydrate: function () {
        return this.getState();
    },

    // Takes an object representing the state of the Fluxible and
    // FluxibleContext instances (usually retrieved from dehydrate) to
    // rehydrate them to the same state as they were on the server
    rehydrate: function (state) {
        this.comments = state;
    }
});


module.exports = ProfileCommentsStore;
