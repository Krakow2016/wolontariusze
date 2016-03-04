var React = require('react')
var ActivityAdministration = require('./ActivityAdministration.jsx')

var ActivityEdit = React.createClass({

  render: function() {
    return (
      <ActivityAdministration context={this.props.context} creationMode={false} taskMode={true} />
    )
  }

})

/* Module.exports instead of normal dom mounting */
module.exports = ActivityEdit
