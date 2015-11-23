var React = require('react')
var Paper = require('material-ui/lib/paper')
var navigateAction = require('fluxible-router').navigateAction

var Password = require('./Settings/Password.jsx')
var updateVolonteer = require('../actions').updateVolonteer
var VolonteerStore = require('../stores/Volonteer')

var Welcome = React.createClass({

  getInitialState: function () {
    return {
      profile: this.props.context.getStore(VolonteerStore).getState().profile,
      canSubmit: false
    }
  },

  _changeListener: function() {
    if(this.props.context.getStore(VolonteerStore).getState().success) {
      // Hasło zostało zmienione
      this.props.context.executeAction(navigateAction, {
        type: 'replacestate',
        url: '/ustawienia/profil'
      })
    }
  },

  componentDidMount: function() {
    this.props.context.getStore(VolonteerStore).addChangeListener(this._changeListener)
  },

  componentWillUnmount: function componentWillUnmount() {
    // Usuń funkcję nasłychującą
    this.props.context.getStore(VolonteerStore)
      .removeChangeListener(this._changeListener)
  },

  enableButton: function () {
    this.setState({
      canSubmit: true
    });
  },

  disableButton: function () {
    this.setState({
      canSubmit: false
    });
  },

  handleSubmit: function(data) {
    data.id = this.state.profile.id
    this.props.context.executeAction(updateVolonteer, data)
  },

  render: function() {
    return (
      <Paper className="paper">
        <Formsy.Form className="settingsForm" onSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>
          <p>
            Welcome!
          </p>

          <Password />

          <div className="pure-g">
            <div className="pure-u-1 pure-u-md-1-3"></div>
            <div className="pure-u-1 pure-u-md-2-3">
              <button type="submit" className="pure-button pure-button-primary" disabled={!this.state.canSubmit}>
                Zmień
              </button>
            </div>
          </div>
        </Formsy.Form>
      </Paper>
    )
  }
})

module.exports = Welcome
