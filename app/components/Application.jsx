var React = require('react')
var handleHistory = require('fluxible-router').handleHistory
var addons = require('fluxible-addons-react')
var NavLink = require('fluxible-router').NavLink
var Snackbar = require('material-ui/lib/snackbar')
var navigateAction = require('fluxible-router').navigateAction
var provideContext = addons.provideContext

var ApplicationStore = require('../stores/ApplicationStore')

var Authentication = require('./Authentication.jsx')
var ActivityVolonteersList = require('./ActivityVolonteersList.jsx')
var Message = require('./Message.jsx')

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
      infoMessage: applicationStore.getSuccess(),
      errorMessage: applicationStore.getFailure(),
      title: applicationStore.getPageTitle()
    }
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(ApplicationStore).getState())
  },

  componentDidMount: function() {
    this.props.context.getStore(ApplicationStore)
      .addChangeListener(this._changeListener)

    var that = this
    setTimeout(function() {
      that.setState({
        infoMessage: false,
        errorMessage: false
      })
    }, 5000)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(ApplicationStore)
      .removeChangeListener(this._changeListener)
  },

  handleInfoSnackbarRequestClose: function() {
    this.setState({
      infoMessage: false
    })
  },

  handleErrorSnackbarRequestClose: function() {
    this.setState({
      errorMessage: false
    })
  },

  addActiveVolonteer: function(volunteer) {
    this.context.executeAction(navigateAction, {
      url: '/wolontariusz/'+ volunteer.user_id
    })
  },

          //<input type="text" className="form" id="menu-search-box" />
  render: function() {
    var Handler = this.props.currentRoute.handler

    var searchForm
    var advancedSearch
    var infoMessage
    var errorMessage

    if(this.user()) {

      if(this.user().is_admin) {
        advancedSearch = (
          <NavLink href="/wyszukiwarka">Zaawansowane wyszukiwanie</NavLink>
        )
      }

      searchForm = (
        <span className="search">
          <ActivityVolonteersList id="searchForm" addActiveVolonteer={this.addActiveVolonteer} className="form" />
          <img src="/img/search.svg" id="menu-search-submit" />
          {advancedSearch}
        </span>
      )
    }

    if(this.state.infoMessage) {
      infoMessage = (
        <Message>
          <b>{this.state.infoMessage}</b>
        </Message>
      )
    }

    if(this.state.errorMessage) {
      errorMessage = (
        <Message>
          <b>{this.state.errorMessage}</b>
        </Message>
      )
    }

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
                <span className="">
                  <NavLink href="/zadania">Bank pracy</NavLink>
                  <Authentication user_id={this.user_id()} user_name={this.user_name()} />
                </span>
                  {searchForm}
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
        {infoMessage}
        {errorMessage}
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
