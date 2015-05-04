var React = require('react');
var Fluxible = require('fluxible');
var routrPlugin = require('fluxible-plugin-routr');

var app = new Fluxible({
    component: React.createFactory(require('../../components/Index.jsx'))
});

app.plug(routrPlugin({
    routes: require('./routes')
}));

app.registerStore(require('../../stores/ApplicationStore'));

app.script = '/js/home/client.js'

module.exports = app;

