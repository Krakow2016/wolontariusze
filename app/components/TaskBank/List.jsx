var React = require('react')
var ProfilePic = require('../ProfilePic.jsx')
var NavLink = require('fluxible-router').NavLink
var moment = require('moment')

var Bank = React.createClass({
  render: function () {
    var tasks = this.props.tasks.map(function(task) {
      if(!task) { return }
      var volunteers = (task.volunteers || []).map(function(id) {
        return (
          <ProfilePic
            src={'https://krakow2016.s3.eu-central-1.amazonaws.com/'+id+'/thumb'}
            className='profileThumbnail'
            key={id} />
        )
      })

      var more
      if (task.description.length > 200){
        more = (<span>...</span>)
      }

      var taskActType = '/img/aktywnosc_zadanie.png'
      if (task.act_type === 'wzialem_od_sdm') {
        taskActType = '/img/flaga2.png'
      }
      if (task.act_type === 'dalem_dla_sdm') {
        taskActType = '/img/flaga.png'
      }
      if (task.act_type === 'projekt') {
        taskActType = '/img/aktywnosc_projekt.png'
      }
      if (task.act_type === 'zadanie') {
        taskActType = '/img/aktywnosc_zadanie.png'
      }
      if (task.act_type === 'wydarzenie') {
        taskActType = '/img/aktywnosc_wydarzenie.png'
      }
      return (
        <div className="row task" key={task.id}>
          <div className="col col1 task-color">
            <img src={taskActType} />
          </div>

          <div className="col col11 task-content">
            <h1 className={task.is_urgent ? 'urgent' : ''}>
              <NavLink href={'/zadania/'+task.id}>
                {task.name}
              </NavLink>
            </h1>
            <span className="task-meta">
              <span>Autor: </span>
              <NavLink href={'/zadania?created_by='+ task.created_by.id}>
                {task.created_by.first_name} {task.created_by.last_name}
              </NavLink>
            </span>
            <span className="task-meta">Wolnych miejsc: { task.limit != 0 ? (task.limit - (task.volunteers || []).length) : 'Bez limitu'}</span>
            <span className="task-meta">{((task.tags || []).length != 0) ? (task.tags || []).join(', ') : 'Brak kategorii' }</span>
            <span className="task-meta">Termin zgłoszeń mija: { task.datetime ? moment(task.datetime).calendar() : 'nigdy'}</span>
            <p>
              <NavLink href={'/zadania/'+task.id}>
                { task.description.substring(0,200) }
                { more }
              </NavLink>
            </p>
            <div className="task-volunteers">
              {volunteers}
            </div>
          </div>
        </div>
      )
    })

    return (<div>{tasks}</div>)
  }
})

module.exports = Bank
