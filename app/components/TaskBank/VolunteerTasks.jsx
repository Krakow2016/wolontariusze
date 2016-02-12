var React = require('react')
var Tasks = require('./Tasks.jsx')

var VolunteerTasks = React.createClass({
  render: function () {
    return (
      <Tasks context={this.props.context}
             type={'volunteer'}
             pagination={10} />
    )
  }
})


/* Module.exports instead of normal dom mounting */
module.exports = VolunteerTasks
