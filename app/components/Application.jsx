var React = require('react')
var handleHistory = require('fluxible-router').handleHistory
var addons = require('fluxible-addons-react')
var NavLink = require('fluxible-router').NavLink
var Snackbar = require('material-ui/lib/snackbar')
var provideContext = addons.provideContext

var ApplicationStore = require('../stores/ApplicationStore')

var Authentication = require('./Authentication.jsx')

var injectTapEventPlugin = require('react-tap-event-plugin')
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin()

var Application = React.createClass({

  contextTypes: {
    getStore      : React.PropTypes.func,
    executeAction : React.PropTypes.func,
    getUser       : React.PropTypes.func
  },

  getInitialState: function() {
    // Wyświetl komunikat flash
    var applicationStore = this.props.context.getStore(ApplicationStore)
    return {
      infoSnack: applicationStore.getSuccess(),
      errorSnack: applicationStore.getFailure()
    }
  },

  handleInfoSnackbarRequestClose: function() {
    this.setState({
      infoSnack: false
    })
  },

  handleErrorSnackbarRequestClose: function() {
    this.setState({
      errorSnack: false
    })
  },

  render: function() {
    var Handler = this.props.currentRoute.handler

    var newActivityLink
    var user = this.user()
    if(user && user.is_admin) {
      newActivityLink = <div className="adminToolbar">
            <NavLink href="/nowa_aktywnosc">Nowa aktywność</NavLink>
        </div>
    }

    //render content
    return (
      <div className="container">
        <Snackbar
          open={!!this.state.infoSnack}
          message={this.state.infoSnack || ''}
          autoHideDuration={5000}
          onRequestClose={this.handleInfoSnackbarRequestClose} />
        <Snackbar
          open={!!this.state.errorSnack}
          message={this.state.errorSnack || ''}
          autoHideDuration={5000}
          onRequestClose={this.handleErrorSnackbarRequestClose} />
        <div className="globalNav navBar">
          <NavLink href="/">
              <img src="/img/logo.png" style={{'height': '100px', 'margin': '25px 0'}} />
          </NavLink>
          <Authentication user_id={this.user_id()} user_name={this.user_name()} />
          {newActivityLink}
        </div>
        
        <Handler context={this.context} />
      </div>
    )
  },

  user: function() {
    return this.props.context.getUser()
  },

  user_id: function() {
    return this.user() && this.user().id
  },

  user_name: function() {
    return this.user() && this.user().first_name
  }
})

Application = handleHistory(Application)

// Module.exports instead of normal dom mounting
module.exports = provideContext(Application, {
  getUser: React.PropTypes.func.isRequired
})
