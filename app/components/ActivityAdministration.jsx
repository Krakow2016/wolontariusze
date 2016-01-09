var React = require('react')
var NavLink = require('fluxible-router').NavLink

var ActivityStore = require('../stores/Activity')
var Authentication = require('./Authentication.jsx')
var ActivityVolonteersList = require('./ActivityVolonteersList.jsx');

var DateTime = require('react-datetime');


var actions = require('../actions')
var updateAction = actions.updateActivity
var createAction = actions.createActivity
var deleteAction = actions.deleteActivity
var sendActivityEmailAction = actions.sendActivityEmail;

var ActivityAdministration = React.createClass({

  render: function () {
    var user = this.user();
    var is_admin = user && user.is_admin;
    var body = {};
    if (is_admin) {
      body = <ActivityAdministrationBody {...this.props} user={this.user()}/>
    } else {
       body = <h1>Brak dostępu - zaloguj się jako Administrator</h1>
    }
    return ( 
      <div>
        {body}
      </div>
    )
  },
  
  user: function() {
    return this.props.context.getUser()
  },
  
  user_name: function() {
    return this.user() && this.user().first_name
  }
});

var AddedVolonteer = React.createClass({
    onClick: function () {
        this.props.onRemoveButtonClick(this.props.volonteer);
    },
    render: function () {
      return (
        <div className="addedVolonteer" ><a href={'/wolontariusz/'+this.props.volonteer.id}>{this.props.volonteer.name}</a> <input type="button" className="addedVolonteerRemoveButton" onClick={this.onClick} value="Usuń"/></div>
      )
    }
})

var ActivityAdministrationBody = React.createClass({

  getInitialState: function () {
      return this.props.context.getStore(ActivityStore).getState()
  },

  _changeListener: function() {
    if (this.props.creationMode == true) {
      this.state = {};
    }
    this.setState(this.props.context.getStore(ActivityStore).getState());
  },

  componentDidMount: function() {
    this.props.context.getStore(ActivityStore).addChangeListener(this._changeListener);
  },
  
  componentWillUnmount: function() {
    this.props.context.getStore(ActivityStore).removeChangeListener(this._changeListener);
  },
  
  handleTitleChange: function (evt) {
    var modifiedState = this.state;
    modifiedState.title = evt.target.value;
    this.setState(modifiedState);
  },
  handleStartEventTimestampChange: function (m) {
    //http://stackoverflow.com/questions/18022534/moment-js-and-unix-epoch-conversion
    var modifiedState = this.state;
    modifiedState.startEventTimestamp = m.toDate().getTime();
    this.setState(modifiedState);
  },
  handleDurationChange: function (evt) {
    var modifiedState = this.state;
    modifiedState.duration = evt.target.value;
    this.setState(modifiedState);
  },
  handlePlaceChange: function (evt) {
    var modifiedState = this.state;
    modifiedState.place = evt.target.value;
    this.setState(modifiedState);
  },
  handleIsUrgentChange: function (evt) {
    //https://facebook.github.io/jest/docs/tutorial-react.html
    var modifiedState = this.state;
    modifiedState.is_urgent = !modifiedState.is_urgent;
    this.setState(modifiedState);
  },
  handleContentChange: function (evt) {
    var modifiedState = this.state;
    modifiedState.content = evt.target.value;
    this.setState(modifiedState);
  },
  addActiveVolonteer: function (volonteer) {
    console.log('ButtonClicked', volonteer);
    var modifiedState = this.state;
    if (volonteer.id == 0) {
      alert('Wybierz wolontariusza');
    } else {
      var isPresent = false;
      for (var i = 0; i < modifiedState.activeVolonteers.length; i++) {
        if (modifiedState.activeVolonteers[i].id == volonteer.id) {
          isPresent = true;
          break;
        }
      }
      if(isPresent) {
        alert('Wolontariusz jest już dodany');
      } else {
        modifiedState.activeVolonteers.push(volonteer);
      }
    }
    this.setState(modifiedState);
  },

  removeActiveVolonteer: function (volonteer) {
    var modifiedState = this.state ;
    for (var i = 0; i < modifiedState.activeVolonteers.length; i++) {
      if (modifiedState.activeVolonteers[i].id == volonteer.id) {
        modifiedState.activeVolonteers.splice(i,1);
      }
    }
    this.setState(modifiedState);
  },

  handleMaxVolonteersChange: function (evt) {
    var modifiedState = this.state;
    modifiedState.maxVolonteers = evt.target.value;
    this.setState(modifiedState);
  },
  
 
  
  loadInitialState: function () {
    this.state = {};
    this.setState(this.getInitialState());
  },

  validateInputs: function () {
    var msg = '';
      
    if (this.state.maxVolonteers > 0 && this.state.activeVolonteers.length > this.state.maxVolonteers) {
      msg += "\n Liczba zapisanych wolontariuszy nie powinna przekraczać limitu"
    }
    
    if (msg != '') {
      alert(msg)
      return false;
    }
    
    return true;
  },
  
  update: function () {
    var isInputValid = this.validateInputs();
    if (isInputValid) {
      var modifiedState = this.state;
      modifiedState.editor = {
        id: this.props.user.id,
        name: this.props.user.first_name+" "+this.props.user.last_name,
        email: this.props.user.email
      }
      modifiedState.editionTimestamp = Date.now();
      modifiedState.updateEmail = true;
      this.props.context.executeAction(updateAction, modifiedState);
      
    }
  },
  create: function () {
    var isInputValid = this.validateInputs();
    if (isInputValid) {
      var modifiedState = this.state;
      var timestamp = Date.now();
      modifiedState.creator = {
        id: this.props.user.id,
        name: this.props.user.first_name+" "+this.props.user.last_name,
        email: this.props.user.email
      }
      modifiedState.creationTimestamp = timestamp;
      modifiedState.editor = {
        id: this.props.user.id,
        name: this.props.user.first_name+" "+this.props.user.last_name,
        email: this.props.user.email
      }
      modifiedState.editionTimestamp = timestamp;
      
      this.props.context.executeAction(createAction, modifiedState);
      
    }
  },
  remove: function () {
    this.props.context.executeAction(deleteAction, {id: this.state.id});
  },
  render: function() {    
    var startEventDate = new Date(this.state.startEventTimestamp);
    
    var initialStateButton = []
    if (this.props.creationMode == false) {
      initialStateButton = <input type="button" onClick={this.loadInitialState} value="Przywróć stan" />
    }
    
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
      createButton = <input type="button" onClick={this.remove} value="Usuń" />
    }

    var showButton = []
    if (this.props.creationMode == false) {
      showButton = <a href={"/aktywnosc/"+this.state.id} ><input type="button" value="Wyświetl" /></a>
    }

    var removeActiveVolonteer = this.removeActiveVolonteer
    var list = this.state.activeVolonteers.map(function(volunteer) {
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
        <input name="title" value={this.state.title} onChange={this.handleTitleChange} />
        <br></br>
        
        <b>Czas rozpoczęcia</b> <DateTime open={false} 
                  dateFormat={'YYYY/M/D'}
                  timeFormat={'HH:mm'}
                  value={startEventDate}
                  onChange={this.handleStartEventTimestampChange}/>
        
        <b>Czas trwania </b>
        <br></br>
        <input name="duration" value={this.state.duration} onChange={this.handleDurationChange} />
        <br></br>
        
        <b>Miejsce wydarzenia</b>
        <br></br>
        <input name="place" value={this.state.place} onChange={this.handlePlaceChange} />
        <br></br>
        
        <b>Zadanie jest PILNE? </b>
        <br></br>
        <input type="checkbox" checked={this.state.is_urgent} onChange={this.handleIsUrgentChange} />
        <br></br>
        
        
        <b>Treść </b>
        <br></br>
        <textarea id="activityContentTextarea" name="content" placeholder="Dodaj treść wiadomości" value={this.state.content} onChange={this.handleContentChange} />
        <br></br>
        
        <b>Wolontariusze, którzy biorą udział:</b>
        <br></br>
        <ActivityVolonteersList addActiveVolonteer={this.addActiveVolonteer} />

        {list}

        <b>Limit (maksymalna liczba wolontariuszy, jeśli 0 to brak limitu)</b>
        <br></br>
        <input name="maxVolonteers" value={this.state.maxVolonteers} onChange={this.handleMaxVolonteersChange} />
        <br></br>
        
        
        <div id="activityEditToolbar">
            {initialStateButton}
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
