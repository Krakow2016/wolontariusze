var React = require('react')

var ApplicationStore = require('../stores/ApplicationStore')
var VolonteersStore = require('../stores/Volonteers')
var ActivitiesStore = require('../stores/Activities')

var NavLink = require('fluxible-router').NavLink
var VolonteerList = require('./VolonteersList.jsx')
var ActivitiesList = require('./ActivitiesList.jsx')

var App = React.createClass({
  contextTypes: {
    getUser       : React.PropTypes.func
  },

  getInitialState: function () {
      var volonteers = this.props.context.getStore(VolonteersStore).getAll();
      var activities = this.props.context.getStore(ActivitiesStore).getAll();
      return {
            allVolonteers: volonteers.all,
            allActivities: activities.all
        }

  },

  _changeListener: function() {
      var volonteers = this.props.context.getStore(VolonteersStore).getAll();
      var activities = this.props.context.getStore(ActivitiesStore).getAll();
      this.setState({
            allVolonteers: volonteers.all,
            allActivities: activities.all
        })
  },

  componentDidMount: function() {
      this.props.context.getStore(VolonteersStore).addChangeListener(this._changeListener)
      //this.props.context.getStore(ActivitiesStore).addChangeListener(this._changeListener)
  },

  click: function() {
    alert("React is working")
  },

  render: function () {
    return (
      <div>

        <p style={{'text-align': 'center'}}>
            <NavLink href="/rejestracja">Zarejestruj się!</NavLink>
        </p>

        <h1>Lista wszyskich wolontariuszy:</h1>

        <p style={{'text-align': 'center'}}>
            <NavLink href="/wyszukiwarka">Szukaj</NavLink>
        </p>

        <VolonteerList results={this.state.allVolonteers} />
        
        <h1>Lista wszystkich aktywności: </h1>
        
        <p style={{'text-align': 'center'}}>
            <NavLink href="/aktywnosc/nowa">Utwórz nową</NavLink>
        </p>
        
        <ActivitiesList results={this.state.allActivities} context={this.props.context} />
        
      </div>
    )
  },
})


/* Module.exports instead of normal dom mounting */
module.exports = App
