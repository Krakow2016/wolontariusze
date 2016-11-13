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

var IntlProvider = require('react-intl').IntlProvider
var FormattedMessage = require('react-intl').FormattedMessage
var FormattedHTMLMessage = require('react-intl').FormattedHTMLMessage

var pl = require('react-intl/locale-data/pl')
var addLocaleData = require('react-intl').addLocaleData
addLocaleData([...pl])

var injectTapEventPlugin = require('react-tap-event-plugin')
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin()

var Application = React.createClass({

  propTypes: {
    context: React.PropTypes.object
  },

  contextTypes: {
    getStore: React.PropTypes.func,
    executeAction: React.PropTypes.func,
    getUser: React.PropTypes.func
  },

  getInitialState: function () {
    // Wyświetl komunikat flash
    var applicationStore = this.props.context.getStore(ApplicationStore)
    return {
      flashSuccess: applicationStore.getSuccess(),
      flashFailure: applicationStore.getFailure(),
      title: applicationStore.getPageTitle(),
      lang: applicationStore.lang,
      messages: applicationStore.messages[applicationStore.lang]
    }
  },

  _changeListener: function () {
    var state = this.props.context.getStore(ApplicationStore).getState()
    state.messages = state.messages[state.lang]
    this.setState(state)
  },

  componentDidMount: function () {
    this.props.context.getStore(ApplicationStore)
      .addChangeListener(this._changeListener)
    this.setState({
      "cookie": document.cookie.indexOf("cookie=true")
    })
  },

  componentWillUnmount: function () {
    this.props.context.getStore(ApplicationStore)
      .removeChangeListener(this._changeListener)
  },

  handleInfoSnackbarRequestClose: function () {
    this.setState({
      flashSuccess: false
    })
  },

  handleErrorSnackbarRequestClose: function () {
    this.setState({
      flashFailure: false
    })
  },

  addActiveVolonteer: function (volunteer) {
    this.context.executeAction(navigateAction, {
      url: '/wolontariusz/' + volunteer.user_id
    })
  },

  setPol: function () {
    document.cookie = "lang=pl"
    location.reload();
  },

  setEng: function () {
    document.cookie = "lang=en"
    location.reload();
  },

  setAgree: function(){
    document.cookie = "cookie=true"
    this.setState({
      "cookie": "true"
    })
  },

  render: function () {
    var Handler = this.props.currentRoute.handler

    var searchForm
    var advancedSearch
    var flashSuccess
    var flashFailure
    var article
    var cookie

    if(typeof this.state.cookie === undefined || this.state.cookie == -1){
      cookie = "open"
    }else{
      cookie = ""
    }

    if (this.user()) {

      if (this.user().is_admin) {
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

    if (this.props.currentRoute.name == 'home' || this.props.currentRoute.name == 'login') {
      article = (
        <article>
          <Handler context={this.context} />
        </article>
      )
    } else {
      article = (
        <article className="main-content">
          <Handler context={this.context} />
        </article>
      )
    }

    if (this.state.flashSuccess) {
      flashSuccess = (
        <Message>
          <FormattedMessage id={this.state.flashSuccess} tagName="b" />
        </Message>
      )
    }

    if (this.state.flashFailure) {
      flashFailure = (
        <Message className="alert--error">
          <FormattedMessage id={this.state.flashFailure} tagName="b" />
        </Message>
      )
    }

    // render content
    return (
      <IntlProvider locale={this.state.lang} messages={this.state.messages}>
        <div>
          <header>
            <div className="head-photo">
              <NavLink href="/"><FormattedHTMLMessage id="home-img" /></NavLink>
            </div>
            <nav id="head-nav" className="row">
              <Authentication user_id={this.user_id() } user_name={this.user_name() } search_status={searchForm || false} />
              {searchForm}
            </nav>
            <div id="languages">
              <a href="#" onClick={this.setPol}><span className="flag-icon flag-icon-pl"></span></a>
              <a href="#" onClick={this.setEng}><span className="flag-icon flag-icon-gb"></span></a>
            </div>

          </header>

          {article}
          {flashSuccess}
          {flashFailure}
          <footer>
            <p>
              <FormattedMessage id="footer" />
              <br />
              <NavLink href="/faq"><FormattedMessage id="footer_faq" /></NavLink> | <a href="mailto:goradobra@krakow2016.com" target="_balnk">E-mail</a> | <NavLink href="/kontakt"><FormattedMessage id="footer_contact" /></NavLink> | <NavLink href="/regulamin"><FormattedMessage id="footer_terms" /></NavLink> | <a href="https://github.com/Krakow2016/wolontariusze"><FormattedMessage id="footer_devs" /></a>
            </p>
          </footer>
          <div className={cookie + " cookie-container"}>
            <p>Ta strona używa plików Cookies</p>
            <button onClick={this.setAgree}>Akceptuje</button>
          </div>
        </div>

      </IntlProvider>
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

  user: function () {
    return this.props.context.getUser()
  },

  user_id: function () {
    return this.user() && this.user().id
  },

  user_name: function () {
    return this.user() && this.user().first_name
  }
})

Application = handleHistory(Application)

// Module.exports instead of normal dom mounting
module.exports = provideContext(Application, {
  getUser: React.PropTypes.func.isRequired
})