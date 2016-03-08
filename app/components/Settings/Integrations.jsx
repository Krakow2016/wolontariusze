var React = require('react')
var NavLink = require('fluxible-router').NavLink

var Settings = require('./Settings.jsx')


var Integrations = React.createClass({

  getInitialState: function () {
    return this.props.context.getStore(IntegrationsStore).getState()
  },

  _changeListener: function() {
  },

  componentDidMount: function() {
  },

  componentWillUnmount: function() {
  },

  render: function() {
    return (
      <Settings>
      </Settings>
    )
  }
})

module.exports = Integrations
