var React = require('react')

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
      <a href="/login">Zaloguj się</a>
    )
  }
})

var LogoutButton = React.createClass({
  render: function() {
    return (
      <span>
        Witaj <b>{this.props.user_name}</b>! | <a href="/login">Wyloguj się</a>
      </span>
    )
  }
})

module.exports = Authentication
