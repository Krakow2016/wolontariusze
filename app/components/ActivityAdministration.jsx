var React = require('react')
var NavLink = require('fluxible-router').NavLink

var ActivityStore = require('../stores/Activity')
var Authentication = require('./Authentication.jsx')
var ActivityVolonteersList = require('./ActivityVolonteersList.jsx');

var DateTime = require('react-datetime');

var update = require('react-addons-update')

var actions = require('../actions')
var updateAction = actions.updateActivity
var joinActivityAction = actions.joinActivity
var leaveActivityAction = actions.leaveActivity
var createAction = actions.createActivity
var deleteAction = actions.deleteActivity

var AddedVolonteer = React.createClass({
    onClick: function () {
        this.props.onRemoveButtonClick(this.props.volunteer);
    },
    name: function() {
      var v = this.props.volunteer
      return v.display_name || (v.first_name +' '+ v.last_name)
    },
    render: function () {
      return (
        <div className="addedVolonteer" ><a href={'/wolontariusz/'+this.props.volunteer.user_id}>{this.name()}</a> <input type="button" className="addedVolonteerRemoveButton" onClick={this.onClick} value="Usuń"/></div>
      )
    }
})

var ActivityAdministration = React.createClass({

  getInitialState: function () {
    var state = this.props.context.getStore(ActivityStore).getState()
    // Tworzy kopię tablicy volontariuszy po to żeby później stwierdzić jakie
    // zaszły wn niej zmiany.
    state._volunteers = Object.assign({}, state).volunteers
    return state
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
   var joint = {
     user_id: volunteer.user_id,
     activity_id: this.state.activity.id
    }
    this.setState(update(this.state, {
      volunteers: {$push: [joint]}
    }))
  },

  removeActiveVolonteer: function (volunteer) {
    this.setState(update(this.state, {
      volunteers: {$apply: function(arr) {
        var index = arr.indexOf(volunteer)
        if(index > -1) { arr.splice(index, 1) }
        return arr
      }}
    }))
  },

  validateInputs: function () {
    // TODO: walidacja poprzez Formsy
    var msg = '';
      
    if (this.state.maxVolonteers > 0 && this.state.volunteers.length > this.state.maxVolonteers) {
      msg += "\n Liczba zapisanych wolontariuszy nie powinna przekraczać limitu"
    }
    
    if (msg != '') {
      alert(msg)
      return false;
    }
    
    return true;
  },

  update: function () {
    var isInputValid = this.validateInputs()
    if (isInputValid) {
      var state = this.state
      var context = this.props.context
      // Aktualizuje parametry aktywności
      context.executeAction(updateAction, state.activity)

      // Usuwa wolontariuszy z aktywności
      var removed = state._volunteers.filter(function(i) {
        return state.volunteers.indexOf(i) < 0
      }).map(function(joint) {
        joint.is_canceled = true
        return joint
      })
      if(removed.length) {
        context.executeAction(leaveActivityAction, removed)
      }

      // Dodaje nowych wolontariuszy do aktywności
      var added = state.volunteers.filter(function(i) {
        return state._volunteers.indexOf(i) < 0
      })
      if(added.length) {
        context.executeAction(joinActivityAction, added)
      }
    }
  },

  create: function () {
    var isInputValid = this.validateInputs()
    if (isInputValid) {
      this.props.context.executeAction(createAction, this.state);
    }
  },

  remove: function () {
    this.props.context.executeAction(deleteAction, {id: this.state.activity.id});
  },

  render: function() {
    var startEventDate = new Date(this.state.activity.startEventTimestamp);
    
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
      showButton = <a href={"/aktywnosc/"+this.state.activity.id} ><input type="button" value="Wyświetl" /></a>
    }

    var removeActiveVolonteer = this.removeActiveVolonteer
    var volunteers = this.state.volunteers || []
    var list = volunteers.map(function(volunteer) {
      return (
        <AddedVolonteer
          key={volunteer.user_id}
          volunteer={volunteer}
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
