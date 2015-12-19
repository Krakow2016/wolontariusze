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
  addEmail: function (emails, newEmail) {
    if (newEmail) {
      for (var i = 0; i < emails.length; i++) {
        if (newEmail == emails[i])
          return;
      }
      emails.push(newEmail);
    }
  },
  findEmail: function (allVolonteers, volonteerId) {
    var email;
    if (volonteerId) {
      for (var i=0; i<allVolonteers.length; i++) {
        if (allVolonteers[i].id == volonteerId) {
          email = allVolonteers[i].email;
          break;
        }
      }
    }
    return email;
  },
  //zwraca adresy mailowe wolontariuszy, którzy biorą lub brali udział, twórcy aktywności oraz tego, kto ostatnio edytował
  getUsersEmails: function () {
    var emails = [];
    var findEmail = this.findEmail;
    var allVolonteers = this.props.context.getStore(VolonteersStore).getAll().all
    this.addEmail(emails, findEmail(allVolonteers, this.state.creatorId) );
    this.addEmail(emails, findEmail(allVolonteers, this.state.editorId) );
    this.addEmail(emails, this.props.user.email);
        
    var oldVolonteersIds = this.props.context.getStore(ActivityStore).getState().activeVolonteersIds;
    for (var i = 0; i < oldVolonteersIds.length; i++) {
      this.addEmail(emails, findEmail(allVolonteers, oldVolonteersIds[i]));    
    }
    var newVolonteersIds = this.state.activeVolonteersIds;
    for (var i = 0; i < newVolonteersIds.length; i++) {
      this.addEmail(emails, findEmail(allVolonteers, newVolonteersIds[i]));    
    }
    return emails;
  },
  getChangeList: function () {
    var oldState = this.props.context.getStore(ActivityStore).getState();
    var state = this.state;
    var changes ="";
    if (oldState.title != state.title) {
        changes += "Tytuł \n";
    }
    if (oldState.startEventTimestamp != state.startEventTimestamp) {
        changes += "Czas rozpoczęcia \n";
    }
    if (oldState.duration != state.duration) {
        changes += "Czas trwania \n";
    }
    if (oldState.place != state.place) {
        changes += "Miejsce wydarzenia \n";
    }
    if (oldState.content != state.content) {
        changes += "Treść aktywności \n";
    }
    if (oldState.title != state.title) {
        changes += "Tytuł \n";
    }
    if (oldState.activeVolonteersIds.length != state.activeVolonteersIds.length) {
        changes += "Lista wolontariuszy \n";
    } else {
      for (var i = 0; i < oldState.activeVolonteersIds.length; i++) {
        if (oldState.activeVolonteersIds[i] != state.activeVolonteersIds[i]) {
          changes += "Lista wolontariuszy \n";
          break;
        }
      }
    }
    if (oldState.maxVolonteers != state.maxVolonteers) {
      changes += "Limit wolontariuszy \n";
    }
    return changes;
    
  },
  update: function () {
    var isInputValid = this.validateInputs();
    if (isInputValid) {
    
      var emails = this.getUsersEmails();
      var changeList = this.getChangeList();
      var modifiedState = this.state;
      modifiedState.editorId = this.props.user.id;
      modifiedState.editionTimestamp = Date.now();
      this.props.context.executeAction(updateAction, modifiedState);
      
      var query = {
        users: emails,
        subject: "Została ZMIENIONA aktywnośc: "+this.state.title,
        text: "Jeśli otrzymujesz tego maila, możesz być dopisany do tej aktywności. Aktualna lista wolontariuszy, którzy"+
              " biorą udział znajduje się na stronie http:localhost:7000/aktywnosc/"+this.state.id+" .\n"+
              "Zmienione zostało: \n"+changeList
      }
      this.props.context.executeAction(sendActivityEmailAction, query);
      
    }
  },
  create: function () {
    var isInputValid = this.validateInputs();
    if (isInputValid) {
      var emails = this.getUsersEmails();
      var modifiedState = this.state;
      var timestamp = Date.now();
      modifiedState.creatorId = this.props.user.id;
      modifiedState.creationTimestamp = timestamp;
      modifiedState.editorId = this.props.user.id;
      modifiedState.editionTimestamp = timestamp;
      
      //text będzie dodany później, bo nie znamy id aktywności
      var actionQuery = {
        users: emails,
        subject: "Została UTWORZONA aktywność: "+this.state.title,
      };
      
      var actionData = {
        data: modifiedState,
        query: actionQuery,
      };
      this.props.context.executeAction(createAction, actionData);
      

    }
  },
  remove: function () {
  
    var emails = this.getUsersEmails();
    this.props.context.executeAction(deleteAction, {id: this.state.id});
    
    var query = {
      users: emails,
      subject: "Została USUNIĘTA aktywność: "+this.state.title,
      text: "Jeśli otrzymujesz tego maila, mogłeś być dopisany do tej aktywności. "
    }
    this.props.context.executeAction(sendActivityEmailAction, query);
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
