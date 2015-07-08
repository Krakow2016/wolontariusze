var React = require('react')
var handleHistory = require('fluxible-router').handleHistory
var provideContext = require('fluxible/addons/provideContext')
var connectToStores = require('fluxible/addons/connectToStores')

var ActivityStore = require('../stores/ActivityStore')
var ApplicationStore = require('../stores/ApplicationStore')
var Authentication = require('./Authentication.jsx')

var injectTapEventPlugin = require('react-tap-event-plugin');
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();



var Activity = React.createClass({
  contextTypes: {
    getStore      : React.PropTypes.func,
    executeAction : React.PropTypes.func,
    getUser       : React.PropTypes.func
  },


  getInitialState: function () {
    return this.props.ActivityStore;
  },

  _changeListener: function() {
    this.setState(this.context.getStore(ActivityStore).getState());
  },

  componentDidMount: function() {
    this.context.getStore(ActivityStore).addChangeListener(this._changeListener);
  },

  
  render: function () {
  
    var extra
    var user = this.context.getUser();
    //works with ==, but not with ===
    var is_owner = user && user.id == this.state.creatorId 
    if (user && (user.is_admin || is_owner)) {
      extra = <div>Private field: {this.state.privateField}</div>
    } else {
      extra = <div />
    }
  
    var showTime = function (timestamp) {
        var d = new Date (timestamp);
        var year = d.getFullYear();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var hour = (d.getHours() >= 10) ? (d.getHours()) : ("0"+d.getHours());
        var min = (d.getMinutes() >= 10) ? (d.getMinutes()) : ("0"+d.getMinutes());
        return year+"/"+month+"/"+day+" "+hour+":"+min;
    }
  
    return (
      <div>
            <h2>{this.state.title}</h2>
            Dodano: {showTime(this.state.creationTimestamp)}
            <br></br>
            Czas rozpoczęcia i miejsce wydarzenia: {showTime(this.state.startEventTimestamp)}, {this.state.place}
            <br></br>
            <br></br>
            <span>{this.state.content}</span>
            <br></br>
            {extra}
      </div>
    )
  },

})


Activity = connectToStores(Activity, [ApplicationStore, ActivityStore], function (stores, props) {
  return {
    ApplicationStore: stores.ApplicationStore.getState(),
    ActivityStore: stores.ActivityStore.getState()
  }
})

Activity = handleHistory(Activity)

/* Module.exports instead of normal dom mounting */
module.exports = provideContext(Activity, {
    getUser: React.PropTypes.func.isRequired
})
