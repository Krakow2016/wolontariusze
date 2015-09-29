var React = require('react')

var ApplicationStore = require('../stores/ApplicationStore')
var VolonteersStore = require('../stores/Volonteers')

var Authentication = require('./Authentication.jsx')
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
        <button onClick={this.click}>
          Hello!
        </button>
        <Authentication user_name={this.user_name()} />

        <h1>Lista wszyskich wolontariuszy:</h1>

        <VolonteerList results={this.state.all} />
      </div>
    )
  },

  user: function() {
    return this.context.getUser()
  },

  user_name: function() {
    return this.user() && this.user().first_name
  }
})


/* Module.exports instead of normal dom mounting */
module.exports = App
