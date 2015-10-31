var React = require('react')
var NavLink = require('fluxible-router').NavLink

var ActivityStore = require('../stores/Activity')
var Authentication = require('./Authentication.jsx')

var TimeService = require('../modules/time/TimeService.js')

var Tabs = require('material-ui/lib/tabs/tabs')
var Tab =  require('material-ui/lib/tabs/tab')
var DateTime = require('react-datetime');

var actions = require('../actions')
var updateAction = actions.updateActivity

var Activity = React.createClass({
  
  render: function () {
   
    return ( 
      <div>
        <ActivityTabs user={this.user()} context={this.props.context} />
      </div>
    )
  },
  
  user: function() {
    return this.props.context.getUser()
  },
  
  user_name: function() {
    return this.user() && this.user().first_name
  }

})

var ActivityTabs = React.createClass({
    
  getInitialState: function () {
      return this.props.context.getStore(ActivityStore).getState()
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(ActivityStore).getState());
  },

  componentDidMount: function() {
    this.props.context.getStore(ActivityStore).addChangeListener(this._changeListener);
  },
  
  update: function() {
    this.props.context.executeAction(updateAction, this.state)
  },
  
  onAcceptButtonClick: function () {
    var modifiedState = this.state ;
    modifiedState.activeVolonteersIds.push(this.props.user.id);
    this.setState(modifiedState);
    this.update();
      
  },
  onCancelButtonClick: function () {
    var modifiedState = this.state ;
    for (var i = 0; i < modifiedState.activeVolonteersIds.length; i++) {
        if (modifiedState.activeVolonteersIds[i] == this.props.user.id) {
            modifiedState.activeVolonteersIds.splice(i,1);
        }         
    }
    this.setState(modifiedState);
    this.update();
  },
  
    
  render: function () {
  
    var extra
    var user = this.props.user
    var is_owner = user && user.id === this.state.creatorId
    var is_admin = user && user.is_admin;
    if (is_admin || is_owner) {
      extra = <ExtraAttributesVisible {...this.state} />
    } else {
      extra = <div />
    }
    
    var editTab = {}
    is_admin = true;
    if (is_admin) {
      editTab = <Tab label="Edycja"><ActivityEdit {...this.props} /></Tab>
    }
    
    var activeVolonteersList = {}
    if (this.state.activeVolonteers) {
        activeVolonteersList = this.state.activeVolonteers.map (function (volonteer) {
            return (
                <span><a href={'/wolontariusz/'+volonteer.id}>{volonteer.name}</a>, </span>
            )
        })
    }
    
    var acceptButton = {}
    if (user &&
        this.state.visibilityIds.indexOf(user.id) !== -1 &&
        this.state.activeVolonteers.length < this.state.maxVolonteers &&
        this.state.activeVolonteersIds.indexOf(user.id) == -1 ) {
        acceptButton = <input type="button" onClick={this.onAcceptButtonClick} value="Dopisz się" />
    }
    
    var cancelButton = {}
    if (user &&
        this.state.activeVolonteersIds.indexOf(user.id) !== -1 ) {
        cancelButton = <input type="button" onClick={this.onCancelButtonClick} value="Wypisz się" />
    }
    
    if (user) {
        console.log(user);
    }
    
    return (
    <Tabs>
        <Tab label="Opis" >
            <h2>{this.state.title}</h2>
            <b>Dodano:</b> {TimeService.showTime(this.state.creationTimestamp)} przez <a href={'/wolontariusz/'+this.state.creatorId}>{this.state.creatorName}</a>
            <br></br>
            <b>Ostatnia edycja:</b> {TimeService.showTime(this.state.editionTimestamp)} przez <a href={'/wolontariusz/'+this.state.editorId}>{this.state.editorName}</a>
            <br></br>
            <b>Czas rozpoczęcia:</b> {TimeService.showTime(this.state.startEventTimestamp)}  <b>Czas trwania:</b> {this.state.duration}
            <br></br>
            <b>Miejsce wydarzenia:</b> {this.state.place}
            <br></br>
            <b>Kamyczki: </b> {this.state.points}
            <br></br>
            <br></br>
            <span>{this.state.content}</span>
            <br></br>
            <br></br>
            <b>Wolontariusze, którzy biorą udział:</b> {activeVolonteersList}
            <br></br>
            <b>Limit(maksymalna liczba wolontariuszy):</b> {this.state.volonteersLimit}
            <br></br>
            {acceptButton} {cancelButton}
        </Tab>
        {editTab}
      </Tabs>
    )
  }

})


var ActivityEdit = React.createClass({

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
    var modifiedState = this.state;
    modifiedState.timestamp = m.milliseconds();
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
  handlePointsChange: function (evt) {
    var modifiedState = this.state;
    modifiedState.points = evt.target.value;
    this.setState(modifiedState);
  },
  handleContentChange: function (evt) {
    var modifiedState = this.state;
    modifiedState.content = evt.target.value;
    this.setState(modifiedState);
  },
  loadInitialState: function () {
    this.setState(this.getInitialState());
  },
  validateInputs: function () {
    var msg = '';
    if (!Number.isInteger(this.state.points)) {
        msg += "Liczba kamyczków powinna być nieujemną liczbą całkowitą"
    }
    if (Number.isInteger(this.state.points) && this.state.points < 0 ) {
        msg += "Liczba kamyczków powinna być nieujemną liczbą całkowitą"
    }
    
    if (msg != '') {
        alert(msg)
    }
  },
  update: function () {
    this.validateInputs();
    //this.props.context.executeAction(updateAction, this.state)
  },
  render: function() {    
    var startEventDate = new Date(this.state.startEventTimestamp);
      
    var activeVolonteersList = {}
    if (this.state.activeVolonteers) {
        activeVolonteersList = this.state.activeVolonteers.map (function (volonteer) {
            return (
                <span><a href={'/wolontariusz/'+volonteer.id}>{volonteer.name}</a>, </span>
            )
        })
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
                      defaultValue={startEventDate}
                      onChange={this.handleStartEventTimestampChange}/>
            
            <b>Czas trwania </b>
            <br></br>
            <input name="duration" value={this.state.duration} onChange={this.handleDurationChange} />
            <br></br>
            
            <b>Miejsce wydarzenia</b>
            <br></br>
            <input name="place" value={this.state.place} onChange={this.handlePlaceChange} />
            <br></br>
            
            <b>Kamyczki</b>
            <br></br>
            <input name="points" value={this.state.points} onChange={this.handlePointsChange} />
            <br></br>
            
            <b>Treść </b>
            <br></br>
            <textarea id="activityContentTextarea" name="content" placeholder="Dodaj treść wiadomości" value={this.state.content} onChange={this.handleContentChange} />
            <br></br>
            
            <b>Wolontariusze, którzy biorą udział:</b> 
            <br></br>
            {activeVolonteersList}
            <br></br>
            
            
            <div id="activityEditToolbar">
                <input type="button" onClick={this.loadInitialState} value="Przywróć stan początkowy" />
                <a href="https://guides.github.com/features/mastering-markdown/">
                <input type="button" value="Markdown" />
                </a>
                <input type="button" onClick={this.update} value="Zapisz" />
            </div>
            <br></br>
       </div>
    )
  }
})


var ExtraAttributesVisible = React.createClass({
  render: function() {
    return(
      <p style={{color: 'red'}}><b>Doświadczenie </b></p>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = Activity
