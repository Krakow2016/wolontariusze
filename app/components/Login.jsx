var React = require('react')
var NavLink = require('fluxible-router').NavLink
var FormattedMessage = require('react-intl').FormattedMessage

var App = React.createClass({
  render: function () {
    return (
      <div className="login-container">
        <div className="section group login-form">
          <form action="/login" method="POST">
            <label htmlFor="login">E-mail</label>
            <input type="text" name="username" className="form login" /><br />
            <label htmlFor="pass"><FormattedMessage id="password" /></label>
            <input type="password" name="password" className="form login" /><br />
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
