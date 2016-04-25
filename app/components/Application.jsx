var React = require('react')
var handleHistory = require('fluxible-router').handleHistory
var addons = require('fluxible-addons-react')
var NavLink = require('fluxible-router').NavLink
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
    var article

    if(this.user()) {

      if(this.user().is_admin) {
        advancedSearch = (
          <NavLink href="/wyszukiwarka">Zaawansowane wyszukiwanie</NavLink>
        )
      }
      var searchStyle = {
        position: 'relative'
      }

      searchForm = (
        <div className="col col3 head-section" id="head-search" style={searchStyle}>
          <ActivityVolonteersList id="form" addActiveVolonteer={this.addActiveVolonteer} className="form menu-search-box" />
          <input src="/img/search.svg" id="menu-search-submit" type="image" />
          {advancedSearch}
        </div>
      )
    }

    if(this.props.currentRoute.name == 'home' || this.props.currentRoute.name == 'login'){
      article = (
        <article>
          <Handler context={this.context} />
        </article>
      )
    }else{
      article = (
        <article className="main-content">
          <Handler context={this.context} />
        </article>
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
      <div id="">
        <header>
          <div className="head-photo">
            <NavLink href="/"><img src="/img/homepage/1.svg" id="head-img" alt="" draggable="false" /></NavLink>
          </div>
          <nav id="head-nav" className="row">
            <Authentication user_id={this.user_id()} user_name={this.user_name()} search_status={searchForm || false} />
            {searchForm}
          </nav>

        </header>

        {article}
        {infoMessage}
        {errorMessage}
        <footer>
          <p>
            Strona została zbudowana przez wolontariuszy ŚDM KRAKÓW 2016.
            <br />
            <a href="mailto:goradobra@krakow2016.com" target="_balnk">Kontakt</a> | <NavLink href="/regulamin">Regulamin</NavLink> | <a href="https://github.com/Krakow2016/wolontariusze">Dla programistów</a>
          </p>
        </footer>
      </div>
    )
  },
          //   <section className="inspiration">
          //   <h2 className="text--center">Do not be afraid</h2>
          //   <p className="text--center">St John Paul II</p>
          // </section>
  // <header>
  //    <h1 id="THE-title">{this.state.title}</h1>
  //  </header>
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
