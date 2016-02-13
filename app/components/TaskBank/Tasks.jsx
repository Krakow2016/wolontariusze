var React = require('react')
var NavLink = require('fluxible-router').NavLink
var update = require('react-addons-update')

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

  onPreviousPageButtonClick: function () {
    var page = this.state.page-1
    this.setState(update(this.state, {
      page: {$set: page}
    }))
  },
  
  onNextPageButtonClick: function () {
    var page = this.state.page+1
    this.setState(update(this.state, {
      page: {$set: page}
    }))
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

    //PAGINATION
    var that = this
    var taskNumber = 1
    var taskRows = this.state.filteredData.filter(function () {
      var page = that.state.page
      var pagination = that.props.pagination
      var result = (taskNumber > (page-1)*pagination && taskNumber <= page*pagination)
      taskNumber++
      return result
    })
    taskNumber = taskNumber-1
    var pageNumber = parseInt((taskNumber-1)/(this.props.pagination)) + 1
    //console.log("taskNumber", taskNumber)
    //console.log("pageNumber", pageNumber)
    var paginationButtons = []
    if (this.state.page > 1) {
      paginationButtons.push(<input type="button" onClick={this.onPreviousPageButtonClick} value="Poprzednie" key="previousPage" /> )
    }
    if (this.state.page < pageNumber) {
      paginationButtons.push(<input type="button" onClick={this.onNextPageButtonClick} value="Następne" key="nextPage" /> )
    }
    

    var startNumber = (this.state.page-1)*this.props.pagination+1
    var endNumber = (this.state.page*this.props.pagination < taskNumber) ? this.state.page*this.props.pagination : taskNumber
    var numberDisplay
    if (startNumber == endNumber) {
      numberDisplay = <span>Zadanie {startNumber}</span>
    } else {
      numberDisplay = <span>Zadania {startNumber}-{endNumber}</span>
    }
    
    // TYPE
    taskRows = taskRows.map(function (task) {
      var title = <td className="tasks-title-td"><a href={'/aktywnosc/'+task.id}>{task.title}</a></td>
      
      if (that.props.type === 'open') {
        return (
          <tr>
            {title}  
          </tr>
        )
      }
      if (that.props.type === 'volunteer') {
        return (
          <tr>
            {title}
            <td>Wypisz mnie</td>
          </tr>
        )
      }
      if (that.props.type === 'admin') {
        return (
          <tr>
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
        {numberDisplay}
        {taskTable}
        {paginationButtons}
      </div>
    )
  },

  user: function() {
    return this.props.context.getUser()
  }
})


/* Module.exports instead of normal dom mounting */
module.exports = Tasks
