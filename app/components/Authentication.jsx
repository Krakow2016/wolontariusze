var React = require('react')
var NavLink = require('fluxible-router').NavLink

var Authentication = React.createClass({
  render: function () {
    var loginButton
    if (this.props.user_name) {
      loginButton = <LogoutButton
        user_id={this.props.user_id}
        user_name={this.props.user_name} />
    } else {
      loginButton = <LoginButton />
    }

    return (
      <span className="loginBar">
        {loginButton}
      </span>
    )
  },
})

var LoginButton = React.createClass({
  render: function() {
    return (
      <ul>
        <li><NavLink href="/login">Zaloguj się</NavLink></li>
      </ul>
    )
  }
})

var LogoutButton = React.createClass({
  render: function() {
    return (
      <ul>
        <li><NavLink href="/zadania">Bank pracy</NavLink></li>
        <li><NavLink href={'/wolontariusz/'+this.props.user_id}>Witaj {this.props.user_name}!</NavLink></li>
        <li><NavLink href="/ustawienia">Ustawienia</NavLink></li>
        <li><a href="/logout">Wyloguj się</a></li>
      </ul>
    )
  }
})

module.exports = Authentication
