var React = require('react')

var Message = React.createClass({
  render: function() {
    return (
      <div className="message">
        <div className={ "alert " + this.props.className }>
          { this.props.children }
        </div>
      </div>
    )
  }
})

module.exports = Message
