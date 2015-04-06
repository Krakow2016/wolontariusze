var React = require('react');
var App = React.createFactory(require('./components/Volonteer.jsx'))

var mountNode = document.getElementById("react-main-mount")

React.render(new App({}), mountNode)
