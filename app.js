var React = require('react');
var Fluxible = require('fluxible');
var routrPlugin = require('fluxible-plugin-routr');

var app = new Fluxible({
    component: React.createFactory(require('./app/components/Index.jsx'))
});

app.plug(routrPlugin({
    routes: require('./app/config/routes')
}));

app.registerStore(require('./app/stores/ApplicationStore'));

module.exports = app;
