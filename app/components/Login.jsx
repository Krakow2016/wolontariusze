var React = require('react')

var App = React.createClass({
  render: function () {
    return (
      <div className="section group">
        <div className="col span_2_of_4">
          <form action="/login" method="POST">
            <label htmlFor="login" className="label">Login</label>
            <input type="text" name="username" className="form login" /><br />
            <label htmlFor="pass" className="label">Hasło</label>
            <input type="password" name="password" className="form login" /><br />
            <input type="submit" value="Wejdź" className="submit" />
          </form>
        </div>
      </div>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = App
