var React = require('react')
var handleHistory = require('fluxible-router').handleHistory
var provideContext = require('fluxible/addons/provideContext')
var connectToStores = require('fluxible/addons/connectToStores')
var NavLink = require('fluxible-router').NavLink

var VolonteerStore = require('../stores/VolonteerStore')
var ApplicationStore = require('../stores/ApplicationStore')
var Authentication = require('./Authentication.jsx')

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

  render: function () {
    var extra
    var user = this.user()
    if (user && (user.is_admin || user.is_owner)) {
      extra = <ExtraAttributesVisible {...this.state} />
    } else {
      extra = <div />
    }

    return (
        <div>
            <div className="globalNav navBar"> {/* Nawigacja serwisu */}
                <NavLink href="/">
                    Strona główna
                </NavLink>
                <Authentication user_name={this.user_name()} />
            </div>
            <div className="coverPhoto" style={{'background-image': 'url('+ this.state.background_picture +')'}}>
            </div>
            <div className="container">
                <div className="profileDetails">

                    <img src={this.state.profile_picture} className="profilePicture" />

                    <b>{this.name()}</b>
                    <br/>
                    <span>{this.state.city}</span>

                    <div className="profileBio">
                        <p><b>Interesuje mnie </b>{this.state.interests}</p>
                        <p><b>Chcę się angażować w </b>{this.state.departments}</p>
                        <p><b>Moim wielkim marzeniem jest </b>{this.state.my_dream}</p>
                        <p><b>Wolontariusze z którymi działam</b></p>
                        {extra}
                        <NavLink href="/wolontariusz/1">
                            <img src="http://i.picresize.com/images/2015/05/25/2VNu8.jpg" className="smallProfilePicture" />
                        </NavLink>
                    </div>
                </div>
                <div className="profileActivity">
                    <h3>Ostatnia aktywność:</h3>
                    <div className="activity"></div>
                    <div className="activity"></div>
                    <div className="activity"></div>
                </div>
            </div>
        </div>
    )
  },

  name: function() {
    return this.state.first_name +" "+ this.state.last_name
  },

  user: function() {
    return this.context.getUser()
  },

  user_name: function() {
    return this.user() && this.user().first_name
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
