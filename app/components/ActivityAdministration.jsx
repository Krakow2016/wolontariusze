var React = require('react')
var NavLink = require('fluxible-router').NavLink

var ActivityStore = require('../stores/Activity')
var VolonteersStore = require('../stores/Volonteers')
var Authentication = require('./Authentication.jsx')
var ActivityVolonteersList = require('./ActivityVolonteersList.jsx');

var DateTime = require('react-datetime');


var actions = require('../actions')
var updateAction = actions.updateActivity
var createAction = actions.createActivity
var deleteAction = actions.deleteActivity


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


var ActivityAdministrationBody = React.createClass({

  getInitialState: function () {
      return this.props.context.getStore(ActivityStore).getState()
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(ActivityStore).getState());
  },

  componentDidMount: function() {
    this.props.context.getStore(ActivityStore).addChangeListener(this._changeListener);
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
  handleContentChange: function (evt) {
    var modifiedState = this.state;
    modifiedState.content = evt.target.value;
    this.setState(modifiedState);
  },
  addActiveVolonteer: function (id) {
    console.log('ButtonClicked', id);
    var modifiedState = this.state;
    if (id == 0) {
        alert('Wybierz wolontariusza');
    } else if(modifiedState.activeVolonteersIds.indexOf(id) !== -1) {
        alert('Wolontariusz jest już dodany');
    } else {
        modifiedState.activeVolonteersIds.push(id);
    }
    this.setState(modifiedState);
  },
  removeActiveVolonteer: function (id) {
      var modifiedState = this.state ;
      for (var i = 0; i < modifiedState.activeVolonteersIds.length; i++) {
            if (modifiedState.activeVolonteersIds[i] == id) {
                modifiedState.activeVolonteersIds.splice(i,1);
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
    this.setState(this.getInitialState());
  },

  validateInputs: function () {
    var msg = '';
      
    if (this.state.maxVolonteers > 0 && this.state.activeVolonteersIds.length > this.state.maxVolonteers) {
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
        modifiedState.editorId = this.props.user.id;
        modifiedState.editionTimestamp = Date.now();
        this.props.context.executeAction(updateAction, modifiedState);
    }
  },
  create: function () {
    var isInputValid = this.validateInputs();
    if (isInputValid) {
        var modifiedState = this.state;
        var timestamp = Date.now();
        modifiedState.creatorId = this.props.user.id;
        modifiedState.creationTimestamp = timestamp;
        modifiedState.editorId = this.props.user.id;
        modifiedState.editionTimestamp = timestamp;
        this.props.context.executeAction(createAction, modifiedState)
    }
  },
  remove: function () {
    this.props.context.executeAction(deleteAction, {id: this.state.id});
  },
  render: function() {    
    var startEventDate = new Date(this.state.startEventTimestamp);
    var allVolonteers = this.props.context.getStore(VolonteersStore).getAll().all;
    
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
            
            <b>Treść </b>
            <br></br>
            <textarea id="activityContentTextarea" name="content" placeholder="Dodaj treść wiadomości" value={this.state.content} onChange={this.handleContentChange} />
            <br></br>
            
            <b>Wolontariusze, którzy biorą udział:</b> 
            <br></br>
            <ActivityVolonteersList data={this.state.activeVolonteersIds} 
                                 onAddButtonClick={this.addActiveVolonteer}
                                 onRemoveButtonClick={this.removeActiveVolonteer} 
                                 allVolonteers={allVolonteers}/>
            
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
