var React = require('react')

var Message = React.createClass({
  render: function() {
    return (
      <div className="message">
        {this.props.children}
      </div>
    )
  }
})

module.exports = Message
