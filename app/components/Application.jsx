var React = require('react')
var handleHistory = require('fluxible-router').handleHistory
var provideContext = require('fluxible/addons/provideContext')
var connectToStores = require('fluxible/addons/connectToStores')

var ApplicationStore = require('../stores/ApplicationStore')
var VolonteerStore = require('../stores/VolonteerStore')

var injectTapEventPlugin = require('react-tap-event-plugin');
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var Application = React.createClass({

  contextTypes: {
    getStore      : React.PropTypes.func,
    executeAction : React.PropTypes.func,
    getUser       : React.PropTypes.func
  },

  render: function() {
    var Handler = this.props.currentRoute.get('handler');
    //render content
    return (
      <div>
        <Handler context={this.context} />
      </div>
    );
  }
})

Application = connectToStores(Application, [ApplicationStore, VolonteerStore], function (stores, props) {
  return {
    ApplicationStore: stores.ApplicationStore.getState(),
    VolonteerStore: stores.VolonteerStore.getState()
  }
})

Application = handleHistory(Application)

// Module.exports instead of normal dom mounting
module.exports = provideContext(Application, {
    getUser: React.PropTypes.func.isRequired
})
