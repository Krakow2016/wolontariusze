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
      activities: this.props.context.getStore(ActivitiesStore).dehydrate(),
      act_type: ''
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

  changeActType: function (evt) {
    var target = evt.target != null
      ? evt.target
      : evt.currentTarget
    var value = target.value
    this.setState({
      profile: this.state.profile,
      activities: this.state.activities,
      act_type: value
    })
  },

  render: function() {

    var profile = this.state.profile || {}
    var renderedActivities = []
    var all = this.state.activities ? this.state.activities.all : []
    

    var select  = <div>
                      <span>Typ: </span>
                      <select name="act_type" value={this.state.act_type || ''}  onChange={this.changeActType} >
                          <option value="">Dowolny</option>
                          <option value="dalem_dla_sdm">Dałem dla ŚDM</option>
                          <option value="wzialem_od_sdm">Wziąłęm od ŚDM</option>
                          <option value="projekt">Projekt</option>
                          <option value="zadanie">Zadanie</option>
                          <option value="wydarzenie">Wydarzenie</option>
                      </select>
                  </div>

    var that = this
    all.forEach(function(activity) {

      // Aby nie wyświetlać na stronie aktywności wolontariusza, jeśli jest przypisany do Newslettera
      if (activity.id == 'news') {
        return
      }

      if (that.state.act_type == '') {
        renderedActivities.push(activity)
        return
      }

      if (that.state.act_type == activity.act_type) {
        renderedActivities.push(activity)
        return
      }

    })

    return (
      <VolunteerShell context={this.props.context} profile={profile}>
        <div className="container">
        {select}
          <div className="row">
            
            <div className="col col12">
              <List tasks={renderedActivities} />
            </div>
          </div>
        </div>
      </VolunteerShell>
    )
  }
})

module.exports = Shell
