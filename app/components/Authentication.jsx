var React = require('react')
var NavLink = require('fluxible-router').NavLink

var Authentication = React.createClass({
  render: function () {
    var loginButton
    var classname
    if (this.props.user_name) {
      loginButton = <LogoutButton
        user_id={this.props.user_id}
        user_name={this.props.user_name} />
    } else {
      loginButton = <LoginButton />
    }

    if(this.props.search_status){
      classname = 'col col9 head-section'
    }else{
      classname = 'col col12 head-section'
    }

    return (
      <div className={classname}>
        {loginButton}
      </div>
    )
  },
})

var LoginButton = React.createClass({
  render: function() {
    return (
      <ul id="nav-list">
        <li><NavLink href="/login">Zaloguj się</NavLink></li>
      </ul>
    )
  }
})

var LogoutButton = React.createClass({
  render: function() {
    return (
      <ul id="nav-list">
        <li><NavLink href="/zadania">Bank pracy</NavLink></li>
        <li><NavLink href={'/wolontariusz/'+this.props.user_id}>Witaj {this.props.user_name}!</NavLink></li>
        <li><NavLink href="/ustawienia">Ustawienia</NavLink></li>
        <li><a href="/logout">Wyloguj się</a></li>
      </ul>
    )
  }
})

module.exports = Authentication
