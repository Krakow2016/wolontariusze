var React = require('react');
var Fluxible = require('fluxible');
var fetchrPlugin = require('fluxible-plugin-fetchr');
var RouteStore = require('fluxible-router').RouteStore;

var routes = require('./routes')
var ApplicationStore = require('../../stores/ApplicationStore')
var ActivityStore = require('../../stores/ActivityStore')
var passportPlugin = require('../../plugins/passportPlugin')

var app = new Fluxible({
    component: React.createFactory(require('../../components/Activity.jsx')),
    stores: [
        RouteStore.withStaticRoutes(routes),
        ApplicationStore,
        ActivityStore
    ]
});

app.plug(fetchrPlugin())
app.plug(passportPlugin())

app.script = '/js/activity/client.js'

module.exports = app;
