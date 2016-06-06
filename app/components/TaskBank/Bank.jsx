var React = require('react')
var NavLink = require('fluxible-router').NavLink
var update = require('react-addons-update')

var TaskFilters = require('./TaskFilters.jsx')
var List = require('./List.jsx')
var ActivitiesStore = require('../../stores/Activities.js')
var ActivitiesSearchForm = require('./Search.jsx')
var actions = require('../../actions')
var AddActivityButton = require('./AddActivityButton.jsx')

var Bank = React.createClass({

  propTypes: {
    context: React.PropTypes.object
  },

  getInitialState: function () {
    var state = this.props.context.getStore(ActivitiesStore).dehydrate()
    return state
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
        <NavLink href={"/zadania"} className="profile-ribon-cell" key="all">Bank pracy</NavLink>
    ]

    if(user) {
      tabs.push(
        <NavLink href={'/zadania?volunteer='+user.id} className="profile-ribon-cell" key="my">Biorę udział w</NavLink>
      )
      if(user.is_admin) {
        tabs.push(
          <NavLink href={'/zadania?created_by='+user.id} className="profile-ribon-cell" key="own">Moje zadania</NavLink>
        )
      }
    }

    if (user) {
      return (
        <div className="task-bank">
          <div className="task-nav">
            <div className="col col12 profile-ribon ">
              {tabs}
            </div>
          </div>
          <ActivitiesSearchForm query={this.state.query} handleChange={this.handleChange} submit={this.onSubmit} />

          <TaskFilters
              handleChange={this.handleChange}
              saveTag={this.saveTag}
              removeTag={this.removeTag}
              onSubmit={this.onSubmit}
              query={this.state.query} />

          {this.state.all.length > 3 ? this.addActivityButton() : ''}
          <List tasks={this.state.all} />
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
module.exports = Bank
