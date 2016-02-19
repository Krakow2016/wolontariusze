var React = require('react')
var VolunteerShell = require('./Shell.jsx')

var Shell = React.createClass({
  render: function() {
    return (
      <VolunteerShell context={this.props.context}>
        Tu będzie kalendarz wolontariusza. Za dostarczenie danych odpowiada Kasia.
      </VolunteerShell>
    )
  }
})

module.exports = Shell
