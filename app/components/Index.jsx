var React = require('react')
var Paper = require('material-ui/lib/paper')

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
    this.props.context.getStore(VolonteersStore)
      .addChangeListener(this._changeListener)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(VolonteersStore)
      .removeChangeListener(this._changeListener)
  },

  click: function() {
    alert("React is working")
  },

  render: function () {
    return (
      <Paper className="paper">

        <p style={{'textAlign': 'center'}}>
            <NavLink href="/wyszukiwarka">Szukaj</NavLink>
        </p>
        
      </Paper>
    )
  },
})


/* Module.exports instead of normal dom mounting */
module.exports = App
