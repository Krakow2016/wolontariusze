var React = require('react')
var ActivityAdministration = require('./ActivityAdministration.jsx')

var ActivityCreate = React.createClass({

  render: function () {
    return ( 
      <div>
        <ActivityAdministration context={this.props.context} creationMode={true} />
      </div>
    )
  }
  
})

/* Module.exports instead of normal dom mounting */
module.exports = ActivityCreate