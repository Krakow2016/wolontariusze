var React = require('react')
var NavLink = require('fluxible-router').NavLink

var ActivityStore = require('../stores/ActivityStore')
var Authentication = require('./Authentication.jsx')

var TimeService = require('../modules/time/TimeService.js');

var material = require('material-ui'),
    ThemeManager = new material.Styles.ThemeManager()

var Tabs = material.Tabs,
    Tab = material.Tab

var Activity = React.createClass({

  childContextTypes: {
      muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },

  getInitialState: function () {
      return this.props.context.getStore(ActivityStore).getState()
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(ActivityStore).getState());
  },

  componentDidMount: function() {
    this.props.context.getStore(ActivityStore).addChangeListener(this._changeListener);
  },

  render: function () {
   
    return ( 
      <div>
        <div className="globalNav navBar"> {/* Nawigacja serwisu */}
          <NavLink href="/">
            Strona główna
          </NavLink>
          <Authentication user_name={this.user_name()} />
        </div>
        <ActivityTabs {...this.state} user={this.user()} />
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
  render: function () {
  
    var extra
    var user = this.props.user
    var is_owner = user && user.id === this.props.creatorId
    var is_admin = user && user.is_admin;
    if (is_admin || is_owner) {
      extra = <ExtraAttributesVisible {...this.props} />
    } else {
      extra = <div />
    }
    
    var editTab = {}
    is_admin = true;
    if (is_admin) {
      editTab = <Tab label="Edycja"><ActivityEdit {...this.props} /></Tab>
    }
    
    var activeVolonteersList = {}
    if (this.props.activeVolonteers) {
        activeVolonteersList = this.props.activeVolonteers.map (function (volonteer) {
            return (
                <span><a href={'/wolontariusz/'+volonteer.id}>{volonteer.name}</a>, </span>
            )
        })
    }
    
    var acceptButton = {}
    if (user &&
        this.props.visibilityIds.indexOf(user.id) !== -1 &&
        this.props.activeVolonteers.length < this.props.maxVolonteers &&
        this.props.activeVolonteersIds.indexOf(user.id) == -1 ) {
        acceptButton = <form action="/activityAddActiveVolonteer" method="POST">
              <input type="submit" value="Dopisz się" />
              <input type="hidden" name="activityId" value={this.props.id} />
              <input type="hidden" name="volonteerId" value={user.id} />
            </form>
    }
    
    var cancelButton = {}
    if (user &&
        this.props.activeVolonteersIds.indexOf(user.id) !== -1 ) {
        cancelButton = <form action="/activityRemoveActiveVolonteer" method="POST">
              <input type="submit" value="Wypisz się" />
              <input type="hidden" name="activityId" value={this.props.id} />
              <input type="hidden" name="volonteerId" value={user.id} />
            </form>
    }
    
    if (user) {
        console.log(user);
    }
    
    return (
    <Tabs>
        <Tab label="Opis" >
            <h2>{this.props.title}</h2>
            <b>Dodano:</b> {TimeService.showTime(this.props.creationTimestamp)} przez <a href={'/wolontariusz/'+this.props.creatorId}>{this.props.creatorName}</a>
            <br></br>
            <b>Ostatnia edycja:</b> {TimeService.showTime(this.props.editionTimestamp)} przez <a href={'/wolontariusz/'+this.props.editorId}>{this.props.editorName}</a>
            <br></br>
            <b>Czas rozpoczęcia:</b> {TimeService.showTime(this.props.startEventTimestamp)}  <b>Czas trwania:</b> {this.props.duration}
            <br></br>
            <b>Miejsce wydarzenia:</b> {this.props.place}
            <br></br>
            <b>Kamyczki: </b> {this.props.points}
            <br></br>
            <br></br>
            <span>{this.props.content}</span>
            <br></br>
            <br></br>
            <b>Wolontariusze, którzy biorą udział:</b> {activeVolonteersList}
            <br></br>
            <b>Limit(maksymalna liczba wolontariuszy):</b> {this.props.volonteersLimit}
            <br></br>
            {acceptButton} {cancelButton}
        </Tab>
        {editTab}
      </Tabs>
    )
  }

})


var ActivityEdit = React.createClass({
  render: function() {
    return (
            <form action="/activityEdit" method="POST">
              <b>Tytuł: </b><input type="text" defaultValue={this.props.title} />
              <input type="submit" value="Aktualizuj" />
              <input type="hidden" name="activityId" value={this.props.id} />
              <input type="hidden" name="volonteerId" value={this.props.user.id} />
            </form>
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
