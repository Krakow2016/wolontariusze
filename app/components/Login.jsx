var React = require('react')
var Paper = require('material-ui/lib/paper')

var App = React.createClass({
  render: function () {
    return (
      <Paper className='paper'>
        <form action="/login" method="POST">
          <input name="username" placeholder="email@example.com" />
          <input type="password" name="password" placeholder="hasło" />
          <input type="submit" value="Zaloguj" />
        </form>
      </Paper>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = App
