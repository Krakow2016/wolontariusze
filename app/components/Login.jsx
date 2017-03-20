var React = require('react')
var NavLink = require('fluxible-router').NavLink
var FormattedMessage = require('react-intl').FormattedMessage
var FormattedHTMLMessage = require('react-intl').FormattedHTMLMessage
var CurrentUrlStore = require('../stores/CurrentUrl')

var App = React.createClass({

  getInitialState: function () {
    var state = this.props.context.getStore(CurrentUrlStore).getState()
    return state
  },

  _changeListener: function() {
    var state = this.props.context.getStore(CurrentUrlStore).getState()
    this.setState({
      url: state.url
    })
  },

  componentDidMount: function() {
    this.props.context.getStore(CurrentUrlStore)
      .addChangeListener(this._changeListener)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(CurrentUrlStore)
      .removeChangeListener(this._changeListener)
  },

  redirect_url: function () {
    return this.state.url
  },

  modified_login_url: function () {
    var modified_login_url="/login"
    if (typeof(window) != 'undefined') {
      modified_login_url = window.location.pathname
    }
    return modified_login_url
  },

  render: function () {
    return (
      <div className="login-container">
        <div className="section group login-form">
          <form action="/login" method="POST">
            <label htmlFor="login">E-mail</label>
            <input type="text" name="username" className="form login" /><br />
            <label htmlFor="pass"><FormattedMessage id="password" /></label>
            <input type="password" name="password" className="form login" /><br />
            <input type="hidden" name="modified_login_url" value={this.modified_login_url()} />
            <input type="hidden" name="redirect_url" value={this.redirect_url()} />
            <button type="submit" className="submit">
              <FormattedMessage id="login" />
            </button>
          </form>
          <p>
            <FormattedHTMLMessage id="no_account_message" />{' '}
          </p>
        </div>
      </div>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = App
