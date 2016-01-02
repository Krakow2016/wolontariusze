var React = require('react')
var Paper = require('material-ui/lib/paper')

var ApplicationStore = require('../stores/ApplicationStore')
var VolunteersStore = require('../stores/Volunteers')

var NavLink = require('fluxible-router').NavLink
var VolunteerList = require('./VolunteersList.jsx')

var App = React.createClass({
  contextTypes: {
    getUser       : React.PropTypes.func
  },

  getInitialState: function () {
    return this.props.context.getStore(VolunteersStore).getAll()
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(VolunteersStore).getAll())
  },

  componentDidMount: function() {
    this.props.context.getStore(VolunteersStore)
      .addChangeListener(this._changeListener)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(VolunteersStore)
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