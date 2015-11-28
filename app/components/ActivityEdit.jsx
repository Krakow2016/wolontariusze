var React = require('react')
var ActivityAdministration = require('./ActivityAdministration.jsx')

var ActivityEdit = React.createClass({
  
  render: function () {
    return ( 
      <div>
        <ActivityAdministration context={this.props.context} creationMode={false} />
      </div>
    )
  }
  
})
  
/* Module.exports instead of normal dom mounting */
module.exports = ActivityEdit
