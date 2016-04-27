var React = require('react')
var NavLink = require('fluxible-router').NavLink
var VolunteerShell = require('./Shell.jsx')
var VolunteerStore = require('../../stores/Volunteer')

var Shell = React.createClass({

  getInitialState: function () {
    return this.props.context.getStore(VolunteerStore).getState().profile
  },

  _changeListener: function() {
    this.replaceState(this.props.context.getStore(VolunteerStore).getState().profile)
  },

  componentDidMount: function() {
    this.props.context.getStore(VolunteerStore)
      .addChangeListener(this._changeListener)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(VolunteerStore)
      .removeChangeListener(this._changeListener)
  },

  render: function() {
    return (
      <VolunteerShell context={this.props.context} profile={this.state}>
        Sekcja w budowie
      </VolunteerShell>
    )
  }
})

module.exports = Shell
