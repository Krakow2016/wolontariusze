var React = require('react')

var ApplicationStore = require('../stores/ApplicationStore')
var VolonteersStore = require('../stores/Volonteers')

var NavLink = require('fluxible-router').NavLink
var VolonteerList = require('./VolonteersList.jsx')

var App = React.createClass({
  contextTypes: {
    getUser       : React.PropTypes.func
  },

  getInitialState: function () {
      return this.props.context.getStore(VolonteersStore).getAll()
  },

  _changeListener: function() {
      this.setState(this.props.context.getStore(VolonteersStore).getAll())
  },

  componentDidMount: function() {
      this.props.context.getStore(VolonteersStore).addChangeListener(this._changeListener)
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

        <VolonteerList results={this.state.all} />
      </div>
    )
  },
})


/* Module.exports instead of normal dom mounting */
module.exports = App
