var React = require('react')
var Formsy = require('formsy-react')

var NavLink = require('fluxible-router').NavLink
var Menu = require('material-ui/lib/menus/menu')
var MenuItem = require('material-ui/lib/menus/menu-item')
var Paper = require('material-ui/lib/paper')
var Snackbar = require('material-ui/lib/snackbar')

var VolonteerStore = require('../stores/Volonteer')

var Subpages = {
  'InfoSettings': require('./Settings/Info.jsx'),
  'BasicSettings': require('./Settings/Basic.jsx'),
  'IntegrationsSettings': require('./Settings/Integrations.jsx')
}

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
          <br />
          <NavLink href="/ustawienia/aplikacje">
            Aplikacje
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

  render: function() {
    var component = Subpages[this.state.subpage]
    // Upewnij się że strona którą chcemy wyświetlić jest zdefiniowana
    if(!component) {
      throw new Error('Komponent '+this.state.subpage+' nie istnieje.')
    }

    var subpage = React.createElement(component, {
        context: this.props.context,
        profile: this.state.profile
    })
    var snackbar

    if (this.state.success) {
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
        <div className="pure-g">
          <LeftPanel />
          <div className="pure-u-3-4">
            {subpage}
          </div>
        </div>
        {snackbar}
      </Paper>
    )
  }
})

module.exports = Settings
