var React = require('react')
var handleHistory = require('fluxible-router').handleHistory
var provideContext = require('fluxible/addons/provideContext');
var connectToStores = require('fluxible/addons/connectToStores');
var NavLink = require('fluxible-router').NavLink;

var VolonteerStore = require('../stores/VolonteerStore')
var ApplicationStore = require('../stores/ApplicationStore')

var Volonteer = React.createClass({
  contextTypes: {
    getStore      : React.PropTypes.func,
    executeAction : React.PropTypes.func,
    getUser       : React.PropTypes.func
  },

  getInitialState: function () {
    return this.props.VolonteerStore;
  },

  _changeListener: function() {
    this.setState(this.context.getStore(VolonteerStore).getState());
  },

  componentDidMount: function() {
    this.context.getStore(VolonteerStore).addChangeListener(this._changeListener);
  },

  click: function() {
    alert('hello '+this.name())
  },

  render: function () {
    return (
      <div>
        <button onClick={this.click}>
          Hello {this.state.first_name}!
        </button>

        <img src={this.state.profile_picture} />
        <b>{this.name()}</b>
        <span>{this.state.city}</span>

        <br />
        <NavLink href="/wolontariusz/1">wolontariusz 1</NavLink>
        <NavLink href="/wolontariusz/2">wolontariusz 2</NavLink>

        <br />
        <a href="/login">login</a>
      </div>
    )
  },

  name: function() {
    return this.state.first_name +" "+ this.state.last_name
  }
})

Volonteer = connectToStores(Volonteer, [ApplicationStore, VolonteerStore], function (stores, props) {
  return {
    ApplicationStore: stores.ApplicationStore.getState(),
    VolonteerStore: stores.VolonteerStore.getState()
  }
})

Volonteer = handleHistory(Volonteer)

/* Module.exports instead of normal dom mounting */
module.exports = provideContext(Volonteer, {
    getUser: React.PropTypes.func.isRequired
})
