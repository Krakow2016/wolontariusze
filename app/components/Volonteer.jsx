var React = require('react')
var NavLink = require('fluxible-router').NavLink

var VolonteerStore = require('../stores/Volonteer')

var Tabs = require('material-ui/lib/tabs/tabs')
var Tab =  require('material-ui/lib/tabs/tab')

var ProfileComments = require('./ProfileComments.jsx')

var actions = require('../actions')
var showCommentsAction = actions.showComments;

var Volonteer = React.createClass({

  getInitialState: function () {
      return this.props.context.getStore(VolonteerStore).getState()
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(VolonteerStore).getState());
  },

  componentDidMount: function() {
    this.props.context.getStore(VolonteerStore).addChangeListener(this._changeListener);
  },

  render: function () {
    return (
      <div>
        <div className="coverPhoto" style={{backgroundImage: 'url('+ this.state.background_picture +')'}}>
        </div>
        <ProfileTabs {...this.state} context={this.props.context}/>
      </div>
    )
  },
})



var ProfileTabs = React.createClass({

  showProfileComments: function (){
    console.log ('show comments');
    this.props.context.executeAction(showCommentsAction, {
      volonteerId: this.props.id
    })
  },

  render: function() {

    var extra
    var user = this.user()
    var is_owner = user && user.id === this.props.id
    var is_admin = user && user.is_admin;
    if (is_admin || is_owner) {
      extra = <ExtraAttributesVisible {...this.props} />
    } else {
      extra = <div />
    }
    var commentsTab = {}
    if (is_admin) {
      commentsTab = <Tab label="Komentarze" onActive={this.showProfileComments}>
        <ProfileComments volonteerId={this.props.id} adminId={user.id} context={this.props.context}></ProfileComments>
      </Tab>
    }

    return (
      <Tabs>
        <Tab label="Item One" >
          <div className="profileDetails">

            <img src={this.props.profile_picture} className="profilePicture" />

            <b className="fullName">{this.name()}</b>
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
        {commentsTab}
      </Tabs>
    )
  },

  name: function() {
    return this.props.first_name +" "+ this.props.last_name
  },

  user: function() {
    return this.props.context.getUser()
  }
})

var ExtraAttributesVisible = React.createClass({
  render: function() {
    return(
      <p style={{color: 'red'}}><b>Doświadczenie </b>{this.props.experience}</p>
    )
  }
})

// Module.exports instead of normal dom mounting
module.exports = Volonteer
