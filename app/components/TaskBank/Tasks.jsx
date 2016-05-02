var React = require('react')
var NavLink = require('fluxible-router').NavLink
var update = require('react-addons-update')

var TaskFilters = require('./TaskFilters.jsx')
var ProfilePic = require('../ProfilePic.jsx')
var TimeService = require('../../modules/time/TimeService.js')
var ActivitiesStore = require('../../stores/Activities.js')
var ActivityStore = require('../../stores/Activity')
var ActivitiesSearchForm = require('./Search.jsx')
var actions = require('../../actions')
var AddActivityButton = require('./AddActivityButton.jsx')

var Tasks = React.createClass({

  getInitialState: function () {
    var state = this.props.context.getStore(ActivitiesStore).dehydrate()
    state.activity = this.props.context.getStore(ActivityStore).getState()
    return state
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(ActivitiesStore).dehydrate())
  },

  componentDidMount: function() {
    this.props.context.getStore(ActivitiesStore)
      .addChangeListener(this._changeListener)
    this.props.context.getStore(ActivityStore)
      .addChangeListener(this._changeListener)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(ActivitiesStore)
      .removeChangeListener(this._changeListener)
    this.props.context.getStore(ActivityStore)
      .removeChangeListener(this._changeListener)
  },

  handleChange: function(event) {
    var query = this.state.query
    query[event.target.name] = event.target.value
    this.setState({
      query: query
    })
  },

  saveTag: function(tag) {
    var query = this.state.query
    query.tags = query.tags || []
    this.setState(update(this.state, {
      query: {tags: {$push: [tag]}}
    }))
  },

  removeTag: function(e) {
    var query = this.state.query
    var tag = e.target.dataset.tag
    var index = query.tags.indexOf(tag)
    this.setState(update(this.state, {
      query: {tags: {$splice: [[index, 1]]}}
    }))
  },

  onSubmit: function(){
    var state = this.state.query
    this.props.context.executeAction(actions.loadActivities, state)

    // Zapisuje zapytanie w adresie url
    var base = window.location.toString().replace(new RegExp('[?](.*)$'), '')
    var attributes = Object.keys(state).filter(function(key) {
      return state[key]
    }).map(function(key) {
      return key + '=' + state[key]
    }).join('&')

    history.replaceState({}, '', base +'?'+ attributes)
  },

  render: function () {
    var user = this.user()

    // TABS
    var tabs = [
      <li>
        <NavLink href={"/zadania"} className="profile-ribon-cell">Bank pracy</NavLink>
      </li>
    ]

    if(user) {
      tabs.push(
        <li><NavLink href={'/zadania?volunteer='+user.id} className="profile-ribon-cell">Biorę udział w</NavLink></li>
      )
      if(user.is_admin) {
        tabs.push(
          <li><NavLink href={'/zadania?created_by='+user.id} className="profile-ribon-cell">Moje zadania</NavLink></li>
        )
      }
    }

    var tasks = this.state.all.map(function(task) {
      if(!task) { return }
      var volunteers = (task.volunteers || []).map(function(id) {
        return (
          <ProfilePic src={'https://krakow2016.s3.eu-central-1.amazonaws.com/'+id+'/thumb'} className='profileThumbnail' />
        )
      })
      var tresc = [(task.description.length > 200) ? task.description.substring(0,200) : task.description]
      if (task.description.length > 200){
        tresc.push(<a href={'/zadania/'+task.id}> ...więcej</a>)
      }

      return (
        <div className="row task">
          <div className="col col1 task-color">
            <img src={task.act_type === 'wzialem_od_sdm' ? '/img/flaga2.png' : '/img/flaga.png'} />
          </div>

          <div className="col col11 task-content">
            <h1 className={task.is_urgent ? 'urgent' : ''}>
              <NavLink href={'/zadania/'+task.id}>
                {task.name}
              </NavLink>
            </h1>
            <span className="task-meta">
              <NavLink href={'/zadania?created_by='+ task.created_by.id}>
                {task.created_by.first_name} {task.created_by.last_name}
              </NavLink>
            </span>
            <span className="task-meta">Wolnych miejsc: { task.limit != 0 ? (task.limit - (task.volunteers || []).length) : 'Bez limitu'}</span>
            <span className="task-meta">{((task.tags || []).length != 0) ? (task.tags || []).join(', ') : 'Brak kategorii' }</span>
            <span className="task-meta">Termin zgłoszeń: {(typeof (task.datetime) != 'undefined') ? TimeService.showTime(task.datetime) : 'Brak'}</span>
            <p>
              {tresc}
            </p>
            <div className="task-volunteers">
              {volunteers}
            </div>
          </div>
        </div>
      )
    })

    if (user) {
      return (
        <div className="task-bank">
          <nav id="task-nav">
            <ul id="nav-list">
              {tabs}
            </ul>
          </nav>
          <ActivitiesSearchForm query={this.state.query} handleChange={this.handleChange} submit={this.onSubmit} />

          <TaskFilters
              handleChange={this.handleChange}
              saveTag={this.saveTag}
              removeTag={this.removeTag}
              onSubmit={this.onSubmit}
              query={this.state.query} />

          {this.addActivityButton()}
          {tasks}
          {this.addActivityButton()}
        </div>
      )
    } else {
      return (<span>Bank pracy widoczny tylko dla zalogowanych użytkowników</span>)
    }
  },

  addActivityButton: function() {
    var user = this.user()
    return user.is_admin ? <AddActivityButton /> : null
  },

  user: function() {
    return this.props.context.getUser()
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = Tasks
