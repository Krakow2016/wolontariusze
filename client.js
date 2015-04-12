var React = require('react');
//var App = React.createFactory(require('../app.jsx'))

//var mountNode = document.getElementById("react-main-mount")

//React.render(new App({}), mountNode)

var debug = require('debug');
var bootstrapDebug = debug('Example');

var app = require('./app');
var dehydratedState = window.App; // Sent from the server

window.React = React; // For chrome dev tool support
debug.enable('*');

bootstrapDebug('rehydrating app');
app.rehydrate(dehydratedState, function (err, context) {
    if (err) {
        throw err;
    }
    window.context = context;
    var mountNode = document.getElementById('app');

    bootstrapDebug('React Rendering');
    var Component = app.getComponent();
    React.render(Component({context:context.getComponentContext()}), mountNode, function () {
        bootstrapDebug('React Rendered');
    });
});
