var React = require('react')

var IntegrationsStore = require('../../stores/Integrations')

var Integration = React.createClass({
  render: function() {
    return (<li>Aplikacja: <b>{this.props.name}</b></li>)
  }
})

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
    var context = this.props.context
    var integrations = this.state.integrations.map(function(integration) {
      return (<Integration context={context} name={integration.name} key={integration.id} />)
    })

    return (
      <div>
        <p>Lista aplikacji:</p>
        <ul>
          {integrations}
        </ul>
      </div>
    )
  }
})

module.exports = Integrations
