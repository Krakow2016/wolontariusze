var React = require('react')

var ActivityStore = require('../stores/ActivityStore')

var Activity = React.createClass({

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
  
    var extra
    var user = this.props.context.getUser();
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


/* Module.exports instead of normal dom mounting */
module.exports = Activity
