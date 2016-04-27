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
      <NavLink href={"/zadania" } className="profile-ribon-cell">
        <b>Bank pracy</b>
      </NavLink>
    ]

    if(user) {
      tabs.push(
        <NavLink href={'/zadania?volunteer='+user.id} className="profile-ribon-cell">
          <b>Biorę udział w</b>
        </NavLink>
      )
      if(user.is_admin) {
        tabs.push(
          <NavLink href={'/zadania?created_by='+user.id} className="profile-ribon-cell">
            <b>Moje zadania</b>
          </NavLink>
        )
      }
    }

    var tasks = this.state.all.map(function (doc) {
      var source = doc._source
      var task = source.doc
      if(!task) { return }
      var priorityClass = task.is_urgent ? 'tasks-priority-urgent-tr' : 'tasks-priority-normal-tr'
      return (
        <tr key={task.id} className={priorityClass}>
          <td className="tasks-name-td"><NavLink href={'/zadania/'+task.id}>{task.name}</NavLink></td>
          <td className="tasks-categories-td"><span>{ (task.tags || []).join(', ') }</span></td>
          <td className="tasks-volunteerNumber-td"><span>{ (task.volunteers || []).length }</span></td>
          <td className="tasks-volunteerLimit-td"><span>{task.limit != 0 ? task.limit : 'Brak'}</span></td>
          <td className="tasks-creationDate-td"><span>{TimeService.showTime(task.created_at)}</span></td>
          <th className="tasks-expirationDate-td"><span>{(typeof (task.datetime) != 'undefined') ? TimeService.showTime(task.datetime) : 'Brak'}</span></th>
        </tr>
      )
    })

    if (user) {
      return (
        <div className="taskBank">
          <div className="row">
            <div className="col col12 profile-ribon">
              {tabs}
            </div>
          </div>

          <TaskFilters
              handleChange={this.handleChange}
              saveTag={this.saveTag}
              removeTag={this.removeTag}
              onSubmit={this.onSubmit}
              query={this.state.query} />

          <table className="tasks-table">
            <tbody>
              <tr>
                <th className="tasks-th" onClick={this.sortByName}>Tytuł</th>
                <th className="tasks-th" onClick={this.sortByCategories}>Kategorie</th>
                <th className="tasks-th" onClick={this.sortByVolunteerNumber}>Liczba osób</th>
                <th className="tasks-th" onClick={this.sortByVolunteerLimit}>Limit osób</th>
                <th className="tasks-th" onClick={this.sortByCreationDate}>Czas utworzenia</th>
                <th className="tasks-th" onClick={this.sortByExpirationDate}>Czas wygaśnięcia</th>
                <th className="tasks-th" >Tytuł</th>
                <th className="tasks-th" >Kategorie</th>
                <th className="tasks-th" >Liczba osób</th>
                <th className="tasks-th" >Limit osób</th>
                <th className="tasks-th" >Czas utworzenia</th>
                <th className="tasks-th" >Czas wygaśnięcia</th>
              </tr>
              {tasks}
            </tbody>
          </table>

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


/* Module.exports instead of normal dom mounting */
module.exports = Tasks
