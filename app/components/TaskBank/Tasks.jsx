var React = require('react')
var NavLink = require('fluxible-router').NavLink
var update = require('react-addons-update')

var TaskFilters = require('./TaskFilters.jsx')
var TimeService = require('../../modules/time/TimeService.js')
var ActivitiesStore = require('../../stores/Activities.js')
var ActivityStore = require('../../stores/Activity')
var ActivitiesSearchForm = require('./Search.jsx')
var actions = require('../../actions')

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
        <li><NavLink href={"/zadania?volunteer="+user.id} className="profile-ribon-cell">Biorę udział w</NavLink></li>
      )
      if(user.is_admin) {
        tabs.push(
          <li><NavLink href={"/zadania?created_by="+user.id} className="profile-ribon-cell">Moje zadania</NavLink></li>
        )
      }
    }

    var tasks = this.state.all.map(function (doc) {
      var source = doc._source
      var task = source.doc
      if(!task) { return }
      var priorityClass = task.is_urgent ? 'tasks-priority-urgent-tr' : 'tasks-priority-normal-tr'
      var tresc = [(task.description.length > 200) ? task.description.substring(0,200) : task.description]
      if (task.description.length > 200){
        tresc.push(<a href={'/zadania/'+task.id}> ...więcej</a>)
      }
      return (
        <div className="row task">
          <div className="col col1 task-color">
            <img src="/img/flaga.png"></img>
          </div>

          <div className="col col11 task-content">
            <h1><NavLink href={'/zadania/'+task.id}>{task.name}</NavLink></h1>
            <span className="task-meta">{}Autor</span>
            <span className="task-meta">Ilość osób: {(source.volunteers || []).length }/{ task.limit != 0 ? task.limit : 'Brak'}</span>
            <span className="task-meta">{((task.tags || []).length != 0) ? (task.tags || []).join(', ') : 'Brak kategorii' }</span>
            <span className="task-meta">{(typeof (task.datetime) != 'undefined') ? TimeService.showTime(task.datetime) : 'Brak'}</span>
            <p>
              {tresc}
            </p>
            <div className="task-volunteers">
              Janusz
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
            {tasks}
          <NavLink href="/zadania/nowe">Dodaj zadanie</NavLink>
        </div>
      )
    } else {
      return (<span>Bank pracy widoczny tylko dla zalogowanych użytkowników</span>)
    }

  },

  user: function() {
    return this.props.context.getUser()
  }
})

          //<TaskFilters
              //handleChange={this.handleChange}
              //saveTag={this.saveTag}
              //removeTag={this.removeTag}
              //onSubmit={this.onSubmit}
              //query={this.state.query} />

/* Module.exports instead of normal dom mounting */
module.exports = Tasks
