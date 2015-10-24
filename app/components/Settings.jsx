var React = require('react')
var Formsy = require('formsy-react')

var List = require('material-ui/lib/lists/list')
var ListItem = require('material-ui/lib/lists/list-item')
var Paper = require('material-ui/lib/paper')

var VolonteerStore = require('../stores/Volonteer')
var BasicSettings = require('./Settings/Basic.jsx')

var LeftPanel = React.createClass({
  render: function() {
    return (
      <div className="pure-u-1-4">
        <Paper zDepth={1}>
          <List>
            <ListItem primaryText="Profil" />
            <ListItem primaryText="Ustawienia" />
          </List>
        </Paper>
      </div>
    )
  }
})

var Settings = React.createClass({

  getInitialState: function () {
    return {
      profile: this.props.context.getStore(VolonteerStore).getState(),
      canSubmit: false
    }
  },

  _changeListener: function() {
    this.setState({
      profile: this.props.context.getStore(VolonteerStore).getState()
    })
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
    this.props.context.executeAction(updateVolonteer, data)
  },

  render: function() {
    return (
      <div className="pure-g">
        <LeftPanel />

        <Formsy.Form className="basicSettingsForm" onSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>
          <div className="pure-u-3-4">
            <BasicSettings {...this.state.profile} />

            <div className="pure-g">
              <div className="pure-u-1 pure-u-md-1-3"></div>
              <div className="pure-u-1 pure-u-md-2-3">
                <button type="submit" className="pure-button pure-button-primary" disabled={!this.state.canSubmit}>
                  Zmień
                </button>
              </div>
            </div>
          </div>
        </Formsy.Form>
      </div>
    )
  }
})

module.exports = Settings
