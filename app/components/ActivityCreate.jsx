var React = require('react')
var Paper = require('material-ui/lib/paper')

var ActivityAdministration = require('./ActivityAdministration.jsx')

var ActivityCreate = React.createClass({
  render: function () {
    return (
      <Paper className="paper">
        <ActivityAdministration context={this.props.context} creationMode={true} />
      </Paper>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = ActivityCreate
