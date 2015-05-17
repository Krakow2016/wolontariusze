var React = require('react')

var App = React.createClass({
  render: function () {
      return (
          <form action="/login" method="POST">
              <input name="username" placeholder="email@example.com" />
              <input type="password" name="password" placeholder="hasło" />
              <input type="submit" value="Zaloguj" />
          </form>
      )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = App
