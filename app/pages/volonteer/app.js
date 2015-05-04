var React = require('react');
var Fluxible = require('fluxible');
var routrPlugin = require('fluxible-plugin-routr');

var app = new Fluxible({
    component: React.createFactory(require('../../components/Volonteer.jsx'))
});

app.plug(routrPlugin({
    routes: require('./routes')
}));

app.registerStore(require('../../stores/VolonteerStore'));

app.script = '/js/volonteer/client.js'

module.exports = app;
