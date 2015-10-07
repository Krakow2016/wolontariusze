var React = require('react')
var NavLink = require('fluxible-router').NavLink

var Authentication = React.createClass({
  render: function () {
    var loginButton
    if (this.props.user_name) {
        loginButton = <LogoutButton user_name={this.props.user_name} />
    } else {
        loginButton = <LoginButton />
    }

    return (
      <div className="loginBar">
        {loginButton}
      </div>
    )
  },
})

var LoginButton = React.createClass({
  render: function() {
    return (
      <NavLink href="/login">Zaloguj się</NavLink>
    )
  }
})

var LogoutButton = React.createClass({
  render: function() {
    return (
      <span>
        Witaj <b>{this.props.user_name}</b>! | <a href="/logout">Wyloguj się</a>
      </span>
    )
  }
})

module.exports = Authentication
