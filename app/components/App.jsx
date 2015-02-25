var React = require('react')

var App = React.createClass({
  click: function() {
    alert('hello')
  },
  render: function () {
    return (
      <button onClick={this.click}>
        Hello!
      </button>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports.App = App
