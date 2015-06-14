var React = require('react')
var NavLink = require('fluxible-router').NavLink
var handleHistory = require('fluxible-router').handleHistory
var provideContext = require('fluxible/addons/provideContext')
var connectToStores = require('fluxible/addons/connectToStores')

var VolonteerStore = require('../stores/VolonteerStore')
var ApplicationStore = require('../stores/ApplicationStore')
var Authentication = require('./Authentication.jsx')

var injectTapEventPlugin = require('react-tap-event-plugin');
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var material = require('material-ui'),
    ThemeManager = new material.Styles.ThemeManager()

var Tabs = material.Tabs,
    Tab = material.Tab

var Volonteer = React.createClass({
  contextTypes: {
    getStore      : React.PropTypes.func,
    executeAction : React.PropTypes.func,
    getUser       : React.PropTypes.func
  },

  childContextTypes: {
      muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
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

  render: function () {
    return (
      <div>
        <div className="globalNav navBar"> {/* Nawigacja serwisu */}
          <NavLink href="/">
            Strona główna
          </NavLink>
          <Authentication user_name={this.user_name()} />
        </div>
        <div className="coverPhoto" style={{backgroundImage: 'url('+ this.state.background_picture +')'}}>
        </div>

        <ProfileTabs {...this.state} user={this.user()} />
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

var ProfileTabs = React.createClass({

  render: function() {

    var extra
    var user = this.props.user
    var is_owner = user && user.id === this.props.id
    if (user && (user.is_admin || is_owner)) {
      extra = <ExtraAttributesVisible {...this.props} />
    } else {
      extra = <div />
    }

    return (
      <Tabs>
        <Tab label="Item One" >
          <div className="profileDetails">

            <img src={this.props.profile_picture} className="profilePicture" />

            <b>{this.name()}</b>
            <br/>
            <span>{this.props.city}</span>

            <div className="profileBio">
              <p><b>Interesuje mnie </b>{this.props.interests}</p>
              <p><b>Chcę się angażować w </b>{this.props.departments}</p>
              <p><b>Moim wielkim marzeniem jest </b>{this.props.my_dream}</p>
              <p><b>Wolontariusze z którymi działam</b></p>
              {extra}
              <NavLink href="/wolontariusz/1">
                <img src="http://i.picresize.com/images/2015/05/25/2VNu8.jpg" className="smallProfilePicture" />
              </NavLink>
            </div>
          </div>
        </Tab>
        <Tab label="Item Two" >
          <div className="profileActivity">
            <h3 style={{display: is_owner ? 'block' : 'none'}}>Jesteś właścicielem tego profilu ☺</h3>
            <h3>Ostatnia aktywność:</h3>
            <div className="activity"></div>
            <div className="activity"></div>
            <div className="activity"></div>
          </div>
        </Tab>
      </Tabs>
    )
  },

  name: function() {
    return this.props.first_name +" "+ this.props.last_name
  }

})

var ExtraAttributesVisible = React.createClass({
  render: function() {
    return(
      <p style={{color: 'red'}}><b>Doświadczenie </b>{this.props.experience}</p>
    )
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
