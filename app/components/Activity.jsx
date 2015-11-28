var React = require('react')
var NavLink = require('fluxible-router').NavLink
var ReactMarkdown = require('react-markdown');

var ActivityStore = require('../stores/Activity')
var VolonteersStore = require('../stores/Volonteers')
var Authentication = require('./Authentication.jsx')
var ActivityEdit = require('./ActivityEdit.jsx')

var TimeService = require('../modules/time/TimeService.js')

var Tabs = require('material-ui/lib/tabs/tabs')
var Tab =  require('material-ui/lib/tabs/tab')
var DateTime = require('react-datetime');
var AutoSuggest = require('react-autosuggest');

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
    
    var editLink
    if(is_admin) {
      editLink = <div className="adminToolbar">
        <NavLink href={"/aktywnosc/"+ this.state.id +"/edytuj"}>Edytuj</NavLink>
      </div>
    }
    
    var activeVolonteersList = []
    if (this.state.activeVolonteers) {
        activeVolonteersList = this.state.activeVolonteers.map (function (volonteer) {
            return (
                <span className="volonteerLabel"><a href={'/wolontariusz/'+volonteer.id}>{volonteer.name}</a></span>
            )
        })
    }
    
    var buttons = [];
    //acceptButton
    if (user &&
        (this.state.activeVolonteersIds.length < this.state.maxVolonteers || this.state.maxVolonteers == 0) &&
        this.state.activeVolonteersIds.indexOf(user.id) == -1 ) {
        buttons.push(<input type="button" onClick={this.onAcceptButtonClick} value="Dopisz się" />)
    }
    
    //canceButton
    if (user &&
        this.state.activeVolonteersIds.indexOf(user.id) !== -1 ) {
        buttons.push(<input type="button" onClick={this.onCancelButtonClick} value="Wypisz się" />)
    }
    
    var tabs = [
        <Tab label="Opis" >
            {editLink}
            <h2>{this.state.title}</h2>
            <b>Dodano:</b> {TimeService.showTime(this.state.creationTimestamp)} przez <span className="volonteerLabel"><a href={'/wolontariusz/'+this.state.creatorId}>{this.state.creatorName}</a></span>
            <br></br>
            <b>Ostatnia edycja:</b> {TimeService.showTime(this.state.editionTimestamp)} przez <span className="volonteerLabel"><a href={'/wolontariusz/'+this.state.editorId}>{this.state.editorName}</a></span>
            <br></br>
            <b>Czas rozpoczęcia:</b> {TimeService.showTime(this.state.startEventTimestamp)}  <b>Czas trwania:</b> {this.state.duration}
            <br></br>
            <b>Miejsce wydarzenia:</b> {this.state.place}
            <br></br>
            <ReactMarkdown source={this.state.content} />
            <br></br>
            <b>Wolontariusze, którzy biorą udział:</b> {activeVolonteersList}
            <br></br>
            <b>Limit(maksymalna liczba wolontariuszy):</b> {this.state.volonteersLimit}
            <br></br>
            {buttons}
        </Tab>
    ]
    
    return (
        <Tabs tabItemContainerStyle={{'backgroundColor': 'rgba(0,0,0,0.1)'}}>
            {tabs}
        </Tabs>
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
