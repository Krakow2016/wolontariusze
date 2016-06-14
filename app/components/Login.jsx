var React = require('react')
var NavLink = require('fluxible-router').NavLink

var App = React.createClass({
  render: function () {
    return (
      <div className="login-container">
        <div className="section group login-form">
          <form action="/login" method="POST">
            <label htmlFor="login">E-mail</label>
            <input type="text" name="username" className="form login" /><br />
            <label htmlFor="pass">Hasło</label>
            <input type="password" name="password" className="form login" /><br />
            <input type="submit" value="Wejdź" className="submit" />
          </form>
          <p>Nie masz konta a jesteś wolontariuszem? <NavLink href="/aktywacja">Kliknij tutaj!</NavLink></p>
        </div>
      </div>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = App
