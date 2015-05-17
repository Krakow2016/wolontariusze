var React = require('react');
var Fluxible = require('fluxible');
var RouteStore = require('fluxible-router').RouteStore;

var fetchrPlugin = require('fluxible-plugin-fetchr');
var passportPlugin = require('../../plugins/passportPlugin')

var routes = require('./routes')
var ApplicationStore = require('../../stores/ApplicationStore')

var app = new Fluxible({
    component: React.createFactory(require('../../components/Index.jsx')),
    stores: [
        RouteStore.withStaticRoutes(routes),
        ApplicationStore,
    ]
});

app.plug(fetchrPlugin())
app.plug(passportPlugin())

app.script = '/js/home/client.js'

module.exports = app;

