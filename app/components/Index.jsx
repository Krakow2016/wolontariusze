var React = require('react')

var ApplicationStore = require('../stores/ApplicationStore')
var Authentication = require('./Authentication.jsx')

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
        <Authentication user_name={this.user_name()} />

        <a href="/wolontariusz/2">Przejdź do przykładowego profilu</a>
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


/* Module.exports instead of normal dom mounting */
module.exports = App
