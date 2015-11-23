var React = require('react')
var handleHistory = require('fluxible-router').handleHistory
var addons = require('fluxible-addons-react')
var NavLink = require('fluxible-router').NavLink
var Snackbar = require('material-ui/lib/snackbar')
var provideContext = addons.provideContext

var ApplicationStore = require('../stores/ApplicationStore')
var VolonteerStore = require('../stores/Volonteer')
var ActivityStore = require('../stores/Activity')

var Authentication = require('./Authentication.jsx')

var injectTapEventPlugin = require('react-tap-event-plugin');
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var Application = React.createClass({

  contextTypes: {
    getStore      : React.PropTypes.func,
    executeAction : React.PropTypes.func,
    getUser       : React.PropTypes.func
  },

  render: function() {
    var Handler = this.props.currentRoute.get('handler');

   // Wyświetl komunikat flash
    var bar
    var successFlash = this.props.context.getStore(ApplicationStore).getSuccess()
    var failureFlash = this.props.context.getStore(ApplicationStore).getFailure()
    if(successFlash) { // Komunikat
      bar = <Snackbar
        openOnMount={true}
        message={successFlash}
        autoHideDuration={5000} />
    } else if(failureFlash) { // Błąd
      bar = <Snackbar
        openOnMount={true}
        message={failureFlash}
        autoHideDuration={5000} />
    }

    //render content
    return (
      <div className="container">
        {bar}
        <div className="globalNav navBar">
          <NavLink href="/">
              <img src="/img/logo.png" style={{'height': '100px', 'margin': '25px 0'}} />
          </NavLink>
          <Authentication user_id={this.user_id()} user_name={this.user_name()} />
        </div>
        <Handler context={this.context} />
      </div>
    );
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
