var React = require('react')
var NavLink = require('fluxible-router').NavLink
var ReactMarkdown = require('react-markdown')

var ActivityStore = require('../stores/Activity')
var TimeService = require('../modules/time/TimeService.js')
var actions = require('../actions')

var Activity = React.createClass({

  getInitialState: function () {
    return this.props.context.getStore(ActivityStore).getState()
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(ActivityStore).getState())
  },

  componentDidMount: function() {
    this.props.context.getStore(ActivityStore)
      .addChangeListener(this._changeListener)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(ActivityStore)
      .removeChangeListener(this._changeListener)
  },

  update: function() {
    this.props.context.executeAction(actions.updateActivity, this.state.activity)
  },

  onAcceptButtonClick: function () {
    var user = this.user()
    var user_id = user && user.id
    this.props.context.executeAction(actions.joinActivity, {
      activity_id: this.state.activity.id,
      user_id: user_id
    })
  },

  onCancelButtonClick: function () {
    this.props.context.executeAction(actions.leaveActivity, {
      id: this.mine().id,
      body: {
        is_canceled: true
      }
    })
  },

  mine: function() {
    var user = this.user()
    var user_id = user && user.id
    if(!user_id) { return }
    return this.state.volunteers.find(function(volunteer) {
      return volunteer.user_id === user_id
    })
  },

  user: function() {
    return this.props.context.getUser()
  },

  render: function () {

    var user = this.user()
    var is_admin = user && user.is_admin
    var activity = this.state.activity

    var editLink
    if(is_admin) {
      editLink = <div className="adminToolbar">
        <NavLink href={'/aktywnosc/'+ activity.id +'/edytuj'}>Edytuj</NavLink>
      </div>
    }

    var priority = (activity.is_urgent) ? 'PILNE' : 'NORMALNE'

    var volunteers = this.state.volunteers
    var has_joined = !!this.mine()

    var activeVolonteersList = volunteers.map(function(volunteer) {
      return (
        <span className="volonteerLabel" key={volunteer.id}>
          <NavLink href={'/wolontariusz/'+volunteer.user_id}>{volunteer.first_name} {volunteer.last_name}</NavLink>
        </span>
      )
    })

    var buttons = []

    //acceptButton
    if (!has_joined && volunteers.length < activity.maxVolunteers) {
      buttons.push(<input type="button" onClick={this.onAcceptButtonClick} value="Zgłaszam się" key="join" />)
    }

    //canceButton
    if (has_joined) {
      buttons.push(<input type="button" onClick={this.onCancelButtonClick} value="Wypisz mnie" key="leave" />)
    }

    var volonteersLimit = (activity.maxVolunteers == 0) ? 'Brak' : activity.maxVolunteers

    // TODO
    //<b>Dodano:</b> {TimeService.showTime(activity.creationTimestamp)} przez <span className="volonteerLabel"><a href={'/wolontariusz/'+activity.creator.id}>{activity.creator.name}</a></span>
    //<b>Ostatnia edycja:</b> {TimeService.showTime(activity.editionTimestamp)} przez <span className="volonteerLabel"><a href={'/wolontariusz/'+activity.editor.id}>{activity.editor.name}</a></span>
    return (
      <div>
        {editLink}
        <h2>{activity.title}</h2>
        <br></br>
        <br></br>
        <b>Czas rozpoczęcia:</b> {TimeService.showTime(activity.datetime)}  <b>Czas trwania:</b> {activity.duration}
        <br></br>
        <b>Miejsce wydarzenia:</b> {activity.place}
        <br></br>
        <b>Prorytet:</b> {priority}
        <br></br>
        <ReactMarkdown source={activity.description} />
        <br></br>
        <b>Wolontariusze, którzy biorą udział:</b> {activeVolonteersList}
        <br></br>
        <b>Limit(maksymalna liczba wolontariuszy):</b> {volonteersLimit}
        <br></br>
        {buttons}
      </div>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = Activity
