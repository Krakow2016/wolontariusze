var React = require('react')
var Formsy = require('formsy-react')

var NavLink = require('fluxible-router').NavLink
var Menu = require('material-ui/lib/menus/menu')
var MenuItem = require('material-ui/lib/menus/menu-item')
var Paper = require('material-ui/lib/paper')
var Snackbar = require('material-ui/lib/snackbar')

var VolonteerStore = require('../stores/Volonteer')

var Subpages = {
  'BasicSettings': require('./Settings/Basic.jsx'),
  'InfoSettings': require('./Settings/Info.jsx')
}

var updateVolonteer = require('../actions').updateVolonteer

var LeftPanel = React.createClass({
  getInitialState: function () {
    return {}
  },

  handleMenuChange: function(e, val) {
    console.log(e, val)
  },

  render: function() {
    return (
      <div className="pure-u-1-4">
        <Paper zDepth={1}>
          <NavLink href="/ustawienia/konto">
            Konto
          </NavLink>
          <br />
          <NavLink href="/ustawienia/profil">
            Informacje publiczne
          </NavLink>
        </Paper>
      </div>
    )
  }
})

var Settings = React.createClass({

  getInitialState: function () {
    return {
      profile: this.props.context.getStore(VolonteerStore).getState().profile,
      subpage: 'BasicSettings',
      canSubmit: false
    }
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(VolonteerStore).getState())
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
    var subpage = React.createElement(Subpages[this.state.subpage], this.state.profile)
    var snackbar

    console.log(this.state.success )
    if (this.state.success ) {
      snackbar = <Snackbar
        openOnMount={true}
        message="Zapisano"
        autoHideDuration={5000} />
    } else if (this.state.error ) {
      snackbar = <Snackbar
        openOnMount={true}
        message="Wystąpił błąd"
        autoHideDuration={5000} />
    }

    return (
      <Paper className="paper">
        <Formsy.Form className="settingsForm" onSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>
          <div className="pure-g">
            <LeftPanel />

            <div className="pure-u-3-4">
              {subpage}

              <div className="pure-g">
                <div className="pure-u-1 pure-u-md-1-3"></div>
                <div className="pure-u-1 pure-u-md-2-3">
                  <button type="submit" className="pure-button pure-button-primary" disabled={!this.state.canSubmit}>
                    Zmień
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Formsy.Form>
        {snackbar}
      </Paper>
    )
  }
})

module.exports = Settings
