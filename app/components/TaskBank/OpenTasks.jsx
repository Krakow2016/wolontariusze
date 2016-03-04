var React = require('react')
var Tasks = require('./Tasks.jsx')

var OpenTasks = React.createClass({
  render: function () {
    return (
      <Tasks context={this.props.context}
             type={'open'}
             pagination={10} />
    )
  }
})


/* Module.exports instead of normal dom mounting */
module.exports = OpenTasks
