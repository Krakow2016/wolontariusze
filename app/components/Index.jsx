var React = require('react')
var provideContext = require('fluxible/addons/provideContext');

var ApplicationStore = require('../stores/ApplicationStore');

var App = React.createClass({
  contextTypes: {
    getUser       : React.PropTypes.func
  },
  click: function() {
    alert("React is working")
  },
  render: function () {
    return (
      <div>
        <button onClick={this.click}>
          Hello!
        </button>
        <Login user_name={this.user_name()} />
      </div>
    )
  },
  user: function() {
    return this.context.getUser()
  },
  user_name: function() {
    return this.user() && this.user().first_name
  }
})

var Login = React.createClass({
  render: function () {
    var loginButton
    if (this.props.user_name) { loginButton = <LogoutButton user_name={this.props.user_name} /> }
    else { loginButton = <LoginButton /> }

    return (
      <div>
        {loginButton}
      </div>
    )
  },
})

var LoginButton = React.createClass({
  render: function() {
    return (
      <a href="/login">
        Zaloguj się
      </a>
    )
  }
})

var LogoutButton = React.createClass({
  render: function() {
    return (
      <span>
        Witaj {this.props.user_name}!
        <a href="/login">
          Wyloguj się
        </a>
      </span>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = provideContext(App, {
    getUser: React.PropTypes.func.isRequired
})
