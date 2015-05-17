var React = require('react');
var Fluxible = require('fluxible');
var fetchrPlugin = require('fluxible-plugin-fetchr');
var RouteStore = require('fluxible-router').RouteStore;

var routes = require('./routes')
var ApplicationStore = require('../../stores/ApplicationStore')
var VolonteerStore = require('../../stores/VolonteerStore')
var passportPlugin = require('../../plugins/passportPlugin')

var app = new Fluxible({
    component: React.createFactory(require('../../components/Volonteer.jsx')),
    stores: [
        RouteStore.withStaticRoutes(routes),
        ApplicationStore,
        VolonteerStore
    ]
});

app.plug(fetchrPlugin())
app.plug(passportPlugin())

app.script = '/js/volonteer/client.js'

module.exports = app;
