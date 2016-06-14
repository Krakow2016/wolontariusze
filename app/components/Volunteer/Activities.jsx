var React = require('react')
var NavLink = require('fluxible-router').NavLink
var List = require('../TaskBank/List.jsx')
var VolunteerShell = require('./Shell.jsx')
var VolunteerStore = require('../../stores/Volunteer')
var ActivitiesStore = require('../../stores/Activities.js')

var Shell = React.createClass({

  propTypes: {
    context: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      profile: this.props.context.getStore(VolunteerStore).getState().profile,
      activities: this.props.context.getStore(ActivitiesStore).dehydrate()
    }
  },

  _changeListener: function() {
    this.setState({
      profile: this.props.context.getStore(VolunteerStore).getState().profile
    })
  },

  _changeListener2: function() {
    this.setState({
      activities: this.props.context.getStore(ActivitiesStore).dehydrate()
    })
  },

  componentDidMount: function() {
    this.props.context.getStore(VolunteerStore)
      .addChangeListener(this._changeListener)
    this.props.context.getStore(ActivitiesStore)
      .addChangeListener(this._changeListener2)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(VolunteerStore)
      .removeChangeListener(this._changeListener)
    this.props.context.getStore(ActivitiesStore)
      .removeChangeListener(this._changeListener2)
  },

  render: function() {
    var profile = this.state.profile || {}
    var given = []
    var received = []
    var all = this.state.activities ? this.state.activities.all : []
    all.forEach(function(activity) {
      if(activity.act_type === 'wzialem_od_sdm') {
        received.push(activity)
      } else {
        given.push(activity)
      }
    })

    return (
      <VolunteerShell context={this.props.context} profile={profile}>
        <div className="container">
          <div className="row">
            <div className="col col6">
              <List tasks={given} />
            </div>
            <div className="col col6">
              <List tasks={received} />
            </div>
          </div>
        </div>
      </VolunteerShell>
    )
  }
})

module.exports = Shell
