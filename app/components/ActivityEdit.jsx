var React = require('react')
var NavLink = require('fluxible-router').NavLink

var ActivityStore = require('../stores/Activity')
var VolonteersStore = require('../stores/Volonteers')
var Authentication = require('./Authentication.jsx')
var ActivityVolonteersList = require('./ActivityVolonteersList.jsx');

var DateTime = require('react-datetime');


var actions = require('../actions')
var updateAction = actions.updateActivity





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
  addVisibilityId: function (id) {
    var modifiedState = this.state;
    if (id == 0) {
        alert('Wybierz wolontariusza lub grupę');
    } else  if(modifiedState.visibilityIds.indexOf(id) !== -1) {
        alert('Wolontariusz lub grupa jest już dodana');
    } else {
        modifiedState.visibilityIds.push(id);
    }
    this.setState(modifiedState);
  },
  removeVisibilityId: function (id) {
      var modifiedState = this.state ;
      for (var i = 0; i < modifiedState.visibilityIds.length; i++) {
            if (modifiedState.visibilityIds[i] == id) {
                modifiedState.visibilityIds.splice(i,1);
            }         
      }
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
   //this.state.visibilityIds = this.getInitialState().visibilityIds;
   //this.state.activeVolonteersIds= this.getInitialState().activeVolonteersIds;
    this.setState(this.getInitialState());
    //this.forceUpdate();
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
    var allVolonteers = this.props.context.getStore(VolonteersStore).getAll().all;
    
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
            
            
            <b>Wolontariusze i grupy, które mogą brać udział:</b> 
            <br></br>
            <ActivityVolonteersList data={this.state.visibilityIds} 
                                 onAddButtonClick={this.addVisibilityId}
                                 onRemoveButtonClick={this.removeVisibilityId} 
                                 allVolonteers={allVolonteers}/>
            <b>Wolontariusze, którzy biorą udział:</b> 
            <br></br>
            <ActivityVolonteersList data={this.state.activeVolonteersIds} 
                                 onAddButtonClick={this.addActiveVolonteer}
                                 onRemoveButtonClick={this.removeActiveVolonteer} 
                                 allVolonteers={allVolonteers}/>
            
            <b>Limit (maksymalna liczba wolontariuszy)</b>
            <br></br>
            <input name="maxVolonteers" value={this.state.maxVolonteers} onChange={this.handleMaxVolonteersChange} />
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

/* Module.exports instead of normal dom mounting */
module.exports = ActivityEdit
