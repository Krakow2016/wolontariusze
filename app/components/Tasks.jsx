Tasks - 
TaskFilters
CoordinatorTasks
OpenTasks
UserTasks
TaskBankvar React = require('react')

var Tasks = React.createClass({
  render: function () {
    return (
      <p>
        Tu będzie bank pracy. Za jego stworzenie odpowiada Paweł.
      </p>
    )
  }
})


/* Module.exports instead of normal dom mounting */
module.exports = Tasks
