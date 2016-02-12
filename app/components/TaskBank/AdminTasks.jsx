var React = require('react')
var Tasks = require('./Tasks.jsx')

var AdminTasks = React.createClass({
  render: function () {
    return (
      <Tasks context={this.props.context}
             type={'admin'}
             pagination={10} />
    )
  }
})


/* Module.exports instead of normal dom mounting */
module.exports = AdminTasks
