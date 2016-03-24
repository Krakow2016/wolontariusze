var React = require('react')
var NavLink = require('fluxible-router').NavLink
var update = require('react-addons-update')

var TaskFilters = require('./TaskFilters.jsx')
var TimeService = require('../../modules/time/TimeService.js')
var ActivitiesStore = require('../../stores/Activities.js')
var ActivitiesSearchForm = require('./Search.jsx')
var actions = require('../../actions')

var Tasks = React.createClass({

  getInitialState: function () {
    return this.props.context.getStore(ActivitiesStore).dehydrate()
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(ActivitiesStore).dehydrate())
  },

  componentDidMount: function() {
    this.props.context.getStore(ActivitiesStore)
      .addChangeListener(this._changeListener)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(ActivitiesStore)
      .removeChangeListener(this._changeListener)
  },

  handleChange: function(event) {
    var query = this.state.query
    query[event.target.name] = event.target.value
    this.setState({
      query: query
    })
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
        <b id="profile-ribon-txt">Bank pracy</b>
      </NavLink>
    ]

    if(user) {
      tabs.push(
        <NavLink href={"/zadania?volunteer="+user.id} className="profile-ribon-cell">
          <b id="profile-ribon-txt">Biorę udział w</b>
        </NavLink>
      )
      if(user.is_admin) {
        tabs.push(
          <NavLink href={"/zadania?created_by="+user.id} className="profile-ribon-cell">
            <b id="profile-ribon-txt">Moje zadania</b>
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
          <div className="section group">
            <div className="col span_4_of_4 profile-ribon">
              {tabs}
            </div>
          </div>
          <TaskFilters filterFunction={this.onSubmit}
            query={this.state.query}
            />
          <ActivitiesSearchForm query={this.state.query} handleChange={this.handleChange} submit={this.onSubmit} />
          <table className="tasks-table">
            <tbody>
              <tr>
                <th className="tasks-th" onClick={this.sortByName}>Tytuł</th>
                <th className="tasks-th" onClick={this.sortByCategories}>Kategorie</th>
                <th className="tasks-th" onClick={this.sortByVolunteerNumber}>Ilość osób</th>
                <th className="tasks-th" onClick={this.sortByVolunteerLimit}>Limit osób</th>
                <th className="tasks-th" onClick={this.sortByCreationDate}>Czas utworzenia</th>
                <th className="tasks-th" onClick={this.sortByExpirationDate}>Czas wygaśnięcia</th>
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
