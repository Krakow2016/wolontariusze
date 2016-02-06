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
      errorSnack: applicationStore.getFailure(),
      title: applicationStore.getPageTitle()
    }
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(ApplicationStore).getState())
  },

  componentDidMount: function() {
    this.props.context.getStore(ApplicationStore)
      .addChangeListener(this._changeListener)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(ApplicationStore)
      .removeChangeListener(this._changeListener)
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

    //render content
    return (
      <div>
        <header>
          <div className="THE-margin">
            <NavLink className="logo" href="/">
              <img src="/img/logo.svg" id="logo" />
            </NavLink>
          </div>
          <nav>
            <div className="THE-margin">
              <div className="section group">
                <div className="col span_3_of_4">
                  <NavLink href="/zadania">Bank pracy</NavLink>
                  <Authentication user_id={this.user_id()} user_name={this.user_name()} />
                </div>
                <div className="col span_1_of_4 search">
                  <form>
                    <input type="text" className="form" id="menu-search-box" />
                    <input type="image" src="/img/search.svg" id="menu-search-submit" />
                  </form>
                  <NavLink href="/wyszukiwarka">Zaawansowane wyszukiwanie</NavLink>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <article>
          <header className="THE-margin">
            <h1 id="THE-title">{this.state.title}</h1>
          </header>
          <div className="THE-margin" id="THE-body">
            <Handler context={this.context} />
          </div>
        </article>
        <footer>
        </footer>
      </div>
    )
  },

  //<Snackbar
    //open={!!this.state.infoSnack}
    //message={this.state.infoSnack || ''}
    //autoHideDuration={5000}
    //onRequestClose={this.handleInfoSnackbarRequestClose} />
  //<Snackbar
    //open={!!this.state.errorSnack}
    //message={this.state.errorSnack || ''}
    //autoHideDuration={5000}
    //onRequestClose={this.handleErrorSnackbarRequestClose} />

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
