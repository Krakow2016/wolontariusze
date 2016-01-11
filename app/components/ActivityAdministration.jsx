var React = require('react')
var ActivityStore = require('../stores/Activity')
var ActivityVolonteersList = require('./ActivityVolonteersList.jsx')

var DateTime = require('react-datetime')

var update = require('react-addons-update')

var actions = require('../actions')
var updateAction = actions.updateActivity
var createAction = actions.createActivity
var deleteAction = actions.deleteActivity

var AddedVolonteer = React.createClass({
  onClick: function () {
    this.props.onRemoveButtonClick(this.props.volonteer)
  },
  render: function () {
    return (
      <div className="addedVolonteer" ><a href={'/wolontariusz/'+this.props.volonteer}>{this.props.volonteer}</a> <input type="button" className="addedVolonteerRemoveButton" onClick={this.onClick} value="Usuń"/></div>
    )
  }
})

var ActivityAdministration = React.createClass({

  getInitialState: function () {
    return this.props.context.getStore(ActivityStore).getState()
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(ActivityStore).getState())
  },

  componentDidMount: function() {
    this.props.context.getStore(ActivityStore)
      .addChangeListener(this._changeListener)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(ActivityStore)
      .removeChangeListener(this._changeListener)
  },

  user: function() {
    return this.props.context.getUser()
  },

  handleStartEventTimestampChange: function (m) {
    //http://stackoverflow.com/questions/18022534/moment-js-and-unix-epoch-conversion
    this.setState(update(this.state, {
      activity: {startEventTimestamp: {$set: m.toDate().getTime()}}
    }))
  },

  handleChange: function (evt) {
    var activity = {}
    var value = evt.target.type === 'checkbox'
      ? event.target.checked
      : evt.target.value
    activity[evt.target.name] = {$set: value}
    this.setState(update(this.state, {
      activity: activity
    }))
  },


  addActiveVolonteer: function (volunteer) {
    this.setState(update(this.state, {
      activity: {volunteers: {$push: [volunteer]}}
    }))
  },

  removeActiveVolonteer: function (volunteer) {
    this.setState(update(this.state, {
      activity: {volunteers: {$apply: function(arr) {
        var index = arr.indexOf(volunteer)
        if(index > -1) { arr.splice(index, 1) }
        return arr
      }}}
    }))
  },

  validateInputs: function () {
    // TODO: walidacja poprzez Formsy
    var msg = ''
      
    if (this.state.maxVolonteers > 0 && this.state.activity.volunteers.length > this.state.maxVolonteers) {
      msg += '\n Liczba zapisanych wolontariuszy nie powinna przekraczać limitu'
    }
    
    if (msg != '') {
      alert(msg)
      return false
    }
    
    return true
  },

  update: function () {
    var isInputValid = this.validateInputs()
    if (isInputValid) {
      this.props.context.executeAction(updateAction, this.state.activity)
    }
  },

  create: function () {
    var isInputValid = this.validateInputs()
    if (isInputValid) {
      this.props.context.executeAction(createAction, this.state.activity)
    }
  },

  remove: function () {
    this.props.context.executeAction(deleteAction, {id: this.state.activity.id})
  },

  render: function() {
    var startEventDate = new Date(this.state.activity.startEventTimestamp)
    
    var updateButton = []
    if (this.props.creationMode == false) {
      updateButton = <input type="button" onClick={this.update} value="Zapisz" />
    }
    
    var createButton = [] 
    if (this.props.creationMode == true) {
      createButton = <input type="button" onClick={this.create} value="Utwórz" />
    }
    
    var removeButton = [] 
    if (this.props.creationMode == false) {
      removeButton = <input type="button" onClick={this.remove} value="Usuń" />
    }

    var showButton = []
    if (this.props.creationMode == false) {
      showButton = <a href={'/aktywnosc/'+this.state.activity.id} ><input type="button" value="Wyświetl" /></a>
    }

    var removeActiveVolonteer = this.removeActiveVolonteer
    var volunteers = this.state.activity.volunteers || []
    var list = volunteers.map(function(volunteer) {
      return (
        <AddedVolonteer
          key={volunteer.id}
          volonteer={volunteer}
          onRemoveButtonClick={removeActiveVolonteer} />
      )
    })

    return (
      <div>
        <b>Tytuł</b> 
        <br></br>
        <input name="title" value={this.state.activity.title} onChange={this.handleChange} />
        <br></br>
        
        <b>Czas rozpoczęcia</b> <DateTime open={false} 
                  dateFormat={'YYYY/M/D'}
                  timeFormat={'HH:mm'}
                  value={startEventDate}
                  onChange={this.handleStartEventTimestampChange}/>
        
        <b>Czas trwania </b>
        <br></br>
        <input name="duration" value={this.state.activity.duration} onChange={this.handleChange} />
        <br></br>
        
        <b>Miejsce wydarzenia</b>
        <br></br>
        <input name="place" value={this.state.activity.place} onChange={this.handleChange} />
        <br></br>

        <b>Zadanie jest PILNE? </b>
        <br></br>
        <input type="checkbox" name="is_urgent" checked={this.state.activity.is_urgent} onChange={this.handleChange} />
        <br></br>

        <b>Treść </b>
        <br></br>
        <textarea id="activityContentTextarea" name="content" placeholder="Dodaj treść wiadomości" value={this.state.activity.content} onChange={this.handleChange} />
        <br></br>

        <b>Wolontariusze, którzy biorą udział:</b>
        <br></br>
        <ActivityVolonteersList addActiveVolonteer={this.addActiveVolonteer} />

        {list}

        <b>Limit (maksymalna liczba wolontariuszy, jeśli 0 to brak limitu)</b>
        <br></br>
        <input name="maxVolonteers" value={this.state.activity.maxVolonteers} onChange={this.handleChange} />
        <br></br>

        <div id="activityEditToolbar">
            <a href="https://guides.github.com/features/mastering-markdown/">
                <input type="button" value="Markdown" />
            </a>
            {removeButton}
            {updateButton}
            {createButton}
            {showButton}
            
        </div>
        <br></br>
      </div>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = ActivityAdministration
