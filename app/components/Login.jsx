var React = require('react')
var NavLink = require('fluxible-router').NavLink
var FormattedMessage = require('react-intl').FormattedMessage

var App = React.createClass({
  
  redirect_url: function () {
    var redirect_url=""
    if (typeof(window) != 'undefined') {
      var location = window.location.href
      var indexOfUrl = location.indexOf("=")
      if (indexOfUrl > -1) {
        var length = location.length
        var modified_login_url = location.substr(indexOfUrl+1, length-1)
        redirect_url = modified_login_url.replace('%SECO%', ':')
        redirect_url = redirect_url.replace('%SLASH%', '/')
        redirect_url = redirect_url.replace('%25SLASH%', '/')
      }
    }
    return redirect_url
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
            <FormattedMessage id="no_account_message" />{' '}
            <NavLink href="/aktywacja"><FormattedMessage id="click_here" /></NavLink>
          </p>
        </div>
      </div>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = App
