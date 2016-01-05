var React = require('react')
var NavLink = require('fluxible-router').NavLink

var Settings = require('./Settings.jsx')
var APIClientsStore = require('../../stores/APIClients')

var APIClient = function(props) {
  return (
    <li>
      <p>Aplikacja: <b>{props.name}</b></p>
      <table className="pure-table">
        <tbody>
          <tr>
            <td>
              Client ID:
            </td>
            <td>
              {props.id}
            </td>
          </tr>
          <tr>
            <td>
              Client secret:
            </td>
            <td>
              {props.secret}
            </td>
          </tr>
          <tr>
            <td>
              Callback url:
            </td>
            <td>
              {props.callback}
            </td>
          </tr>
        </tbody>
      </table>
    </li>
  )
}

var Developer = React.createClass({

  getInitialState: function () {
     return this.props.context.getStore(APIClientsStore).getState()
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(APIClientsStore).getState())
  },

  componentDidMount: function() {
    this.props.context.getStore(APIClientsStore)
      .addChangeListener(this._changeListener)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(APIClientsStore)
      .removeChangeListener(this._changeListener)
  },

  render: function() {
    var integrations = this.state.api_clients.map(function(integration) {
      return (<APIClient {...integration} key={integration.id} />)
    })

    return (
      <Settings>
        <p>Lista moich aplikacji:</p>
        <ul>
          {integrations}
        </ul>
        <NavLink href="/ustawienia/developer/utworz">Zarejestruj nową aplikację</NavLink>
      </Settings>
    )
  }
})

module.exports = Developer
