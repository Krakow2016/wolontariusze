var React = require('react');
var App = React.createFactory(require('./components/App.jsx').App)

var mountNode = document.getElementById("react-main-mount")

React.renderComponent(new App({}), mountNode)
