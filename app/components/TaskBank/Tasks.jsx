var React = require('react')
var NavLink = require('fluxible-router').NavLink

var TasksStore = require('../../stores/Tasks')


var Tasks = React.createClass({

  getInitialState: function () {
    var state = this.props.context.getStore(TasksStore).getState()
    state.filteredData = Object.assign({}, state).data
    return state
  },

  _changeListener: function() {
    this.state.filteredData = {}
    var state = this.props.context.getStore(TasksStore).getState()
    state.filteredData = Object.assign({}, state).data
    this.setState(state)
  },

  componentDidMount: function() {
    this.props.context.getStore(TasksStore)
      .addChangeListener(this._changeListener)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(TasksStore)
      .removeChangeListener(this._changeListener)
  },

  render: function () {
    var user = this.user()

    // TABS
    var tabs = [
      <NavLink href={"/bank_pracy" } className="profile-ribon-cell">
        <b id="profile-ribon-txt">Bank pracy</b>
      </NavLink>
    ]

    if(user) {
      tabs.push(
        <NavLink href={"/bank_pracy/wolontariusz"} className="profile-ribon-cell">
          <b id="profile-ribon-txt">Biorę udział w</b>
        </NavLink>
      )
      if(user.is_admin) {
        tabs.push(
          <NavLink href={"/bank_pracy/admin"} className="profile-ribon-cell">
            <b id="profile-ribon-txt">Moje zadania</b>
          </NavLink>
        )
      }
    }


    // TYPE
    var taskNumber = 1
    var that = this
    var taskRows = this.state.filteredData.map(function (task) {
      
      var number = <td>{taskNumber++}</td>
      var title = <td className="tasks-title-td"><a href={'/aktywnosc/'+task.id}>{task.title}</a></td>
      
      if (that.props.type === 'open') {
        return (
          <tr>
            {number}
            {title}  
          </tr>
        )
      }
      if (that.props.type === 'volunteer') {
        return (
          <tr>
            {number}
            {title}
            <td>Wypisz mnie</td>
          </tr>
        )
      }
      if (that.props.type === 'admin') {
        return (
          <tr>
            {number}
            {title}
            <td>Usuń</td>
          </tr>
        ) 
      }
    })


    var taskTable = <table><tbody>{taskRows}</tbody></table>


    return (
      <div className="taskBank">
        <div className="section group">
          <div className="col span_4_of_4 profile-ribon">
            {tabs}
          </div>
        </div>
        {taskTable}
      </div>
    )
  },

  user: function() {
    return this.props.context.getUser()
  }
})


/* Module.exports instead of normal dom mounting */
module.exports = Tasks
