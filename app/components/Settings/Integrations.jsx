var React = require('react')
var NavLink = require('fluxible-router').NavLink

var Settings = require('./Settings.jsx')
var IntegrationsStore = require('../../stores/Integrations')

var Integration = function(props) {
  return (<li>Aplikacja: <b>{props.name}</b></li>)
}

var Integrations = React.createClass({

  getInitialState: function () {
    return this.props.context.getStore(IntegrationsStore).getState()
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(IntegrationsStore).getState())
  },

  componentDidMount: function() {
    this.props.context.getStore(IntegrationsStore)
      .addChangeListener(this._changeListener)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(IntegrationsStore)
      .removeChangeListener(this._changeListener)
  },

  render: function() {
    var integrations = this.state.integrations.map(function(integration) {
      return (<Integration name={integration.name} key={integration.id} />)
    })

    return (
      <Settings>
        <p>Lista integracji:</p>
        
        <p>Lista aplikacji:</p>
        <ul>
          {integrations}
        </ul>
        <NavLink href="/ustawienia/developer">Dla deweloperów</NavLink>
      </Settings>
    )
  }
})

module.exports = Integrations
