var React = require('react')
var NavLink = require('fluxible-router').NavLink
var update = require('react-addons-update')
var TaskFilters = require('./TaskFilters.jsx')

var TimeService = require('../../modules/time/TimeService.js')

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

  sortByTitle: function () {
    //http://www.w3schools.com/jsref/jsref_sort.asp
    //http://www.w3schools.com/js/js_comparisons.asp
    var filteredData = this.state.filteredData
    var order = this.state.order
    filteredData = filteredData.sort(function (task1, task2) {
      return (task1.title < task2.title) ? -order : order
    })

    this.setState(update(this.state, {
      filteredData: {$set: filteredData},
      order: {$set: -order}
    }))
  },

  sortByCategories: function () {
    var filteredData = this.state.filteredData
    var order = this.state.order
    filteredData = filteredData.sort(function (task1, task2) {
      task1.categories = task1.tags.map(function(t) {return t.name}).join()
      task2.categories = task2.tags.map(function(t) {return t.name}).join()
      return (task1.categories < task2.categories) ? -order : order
    })

    this.setState(update(this.state, {
      filteredData: {$set: filteredData},
      order: {$set: -order}
    }))
  },

  sortByVolunteerNumber: function () {
    var filteredData = this.state.filteredData
    var order = this.state.order
    filteredData = filteredData.sort(function (task1, task2) {
      return (task1.volunteerNumber < task2.volunteerNumber) ? -order : order
    })

    this.setState(update(this.state, {
      filteredData: {$set: filteredData},
      order: {$set: -order}
    }))
  },

  sortByVolunteerLimit: function () {
    var filteredData = this.state.filteredData
    var order = this.state.order
    filteredData = filteredData.sort(function (task1, task2) {
      task1.limit = task1.maxVolunteers != 0 ? task1.maxVolunteers : 1000000
      task2.limit = task2.maxVolunteers != 0 ? task2.maxVolunteers : 1000000
      return (task1.limit < task2.limit) ? -order : order
    })

    this.setState(update(this.state, {
      filteredData: {$set: filteredData},
      order: {$set: -order}
    }))
  },

  sortByCreationDate: function () {
    var filteredData = this.state.filteredData
    var order = this.state.order
    filteredData = filteredData.sort(function (task1, task2) {
      return (task1.created_at < task2.created_at) ? -order : order
    })

    this.setState(update(this.state, {
      filteredData: {$set: filteredData},
      order: {$set: -order}
    }))
  },

  sortByExpirationDate: function () {
    var filteredData = this.state.filteredData
    var order = this.state.order
    filteredData = filteredData.sort(function (task1, task2) {
      task1.expDate = (typeof (task1.datetime) != 'undefined') ? new Date(task1.datetime).getTime() : 100000000000000
      task2.expDate = (typeof (task2.datetime) != 'undefined') ? new Date(task2.datetime).getTime() : 100000000000000
      return (task1.expDate < task2.expDate) ? -order : order
    })

    this.setState(update(this.state, {
      filteredData: {$set: filteredData},
      order: {$set: -order}
    }))
  },

  filter: function (filteredData) {
    this.setState(update(this.state, {
      filteredData: {$set: filteredData},
      page: {$set: 1}
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
      numberDisplay = <span>Zadanie {startNumber} z {taskNumber}</span>
    } else {
      numberDisplay = <span>Zadania {startNumber}-{endNumber} z {taskNumber}</span>
    }

    // TYPE
    var taskHeaders = function () {
      var title = <th className="tasks-th" onClick={that.sortByTitle}>Tytuł</th>
      var categories = <th className="tasks-th" onClick={that.sortByCategories}>Kategorie</th>
      var volunteerNumber = <th className="tasks-th" onClick={that.sortByVolunteerNumber}>Ilość osób</th>
      var volunteerLimit = <th className="tasks-th" onClick={that.sortByVolunteerLimit}>Limit osób</th>
      var creationDate = <th className="tasks-th" onClick={that.sortByCreationDate}>Czas utworzenia</th>
      var expirationDate = <th className="tasks-th" onClick={that.sortByExpirationDate}>Czas wygaśnięcia</th>

      return (
        <tr>
          {title}
          {categories}
          {volunteerNumber}
          {volunteerLimit}
          {creationDate}
          {expirationDate}
        </tr>
      )
    }()

    taskRows = taskRows.map(function (task) {
      var priorityClass = task.is_urgent ? 'tasks-priority-urgent-tr' : 'tasks-priority-normal-tr'
      var title = <td className="tasks-title-td"><a href={'/aktywnosc/'+task.id}>{task.title}</a></td>
      var categories = <td className="tasks-categories-td"><span>{task.tags.map(function (t) {return t.name}).join()}</span></td>
      var volunteerNumber = <td className="tasks-volunteerNumber-td"><span>{task.volunteerNumber}</span></td>
      var volunteerLimit = <td className="tasks-volunteerLimit-td"><span>{task.maxVolunteers != 0 ? task.maxVolunteers : 'Brak'}</span></td>

      var creationDate = <td className="tasks-creationDate-td"><span>{TimeService.showTime(task.created_at)}</span></td>
      var expirationDate = <th className="tasks-expirationDate-td"><span>{(typeof (task.datetime) != 'undefined') ? task.datetime: 'Brak'}</span></th>

      return (
        <tr className={priorityClass}>
          {title}
          {categories}
          {volunteerNumber}
          {volunteerLimit}
          {creationDate}
          {expirationDate}
        </tr>
      )
    })


    var taskTable = <table className="tasks-table"><tbody>{taskHeaders}{taskRows}</tbody></table>


    return (
      <div className="taskBank">
        <div className="section group">
          <div className="col span_4_of_4 profile-ribon">
            {tabs}
          </div>
        </div>
        <br></br>
        <TaskFilters data={this.state.data}
                     filterFunction={this.filter}
                     type={this.props.type}
                     context={this.props.context}
                     />
        <br></br>{numberDisplay}
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
