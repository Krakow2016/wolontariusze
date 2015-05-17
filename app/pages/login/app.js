var React = require('react');
var Fluxible = require('fluxible');
//var fetchrPlugin = require('fluxible-plugin-fetchr');
var RouteStore = require('fluxible-router').RouteStore;
var ApplicationStore = require('../../stores/ApplicationStore')

var app = new Fluxible({
    component: React.createFactory(require('../../components/Login.jsx')),
    stores: [
      RouteStore.withStaticRoutes({
        home: {
          path: '/login',
          method: 'get',
          action: function (context, payload, done) {
              context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: 'Home | flux-examples | routing' });
              done();
          }
        }
      }),
      ApplicationStore
    ]
});

module.exports = app;
