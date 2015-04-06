var React = require('react')

var Volonteer = React.createClass({
  click: function() {
    alert('hello '+this.props.name)
  },
  render: function () {
    return (
      <button onClick={this.click}>
        Hello {this.props.name}!
      </button>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = Volonteer
