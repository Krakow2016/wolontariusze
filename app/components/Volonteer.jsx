var React = require('react')
var NavLink = require('fluxible-router').NavLink

var VolonteerStore = require('../stores/Volonteer')

var Tabs = require('material-ui/lib/tabs/tabs')
var Tab =  require('material-ui/lib/tabs/tab')
var Paper = require('material-ui/lib/paper')

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
         // {this.state.profile_picture}
    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-1-2">
            <img src="/img/profile.jpg" className="profilePicture" />
          </div>
          <div className="pure-u-1-2">
            <h1 className="fullName">{this.name()}</h1>
          </div>
        </div>
          <ProfileTabs {...this.state} context={this.props.context}/>
      </div>
    )
  },

  name: function() {
    return this.state.first_name +" "+ this.state.last_name
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

    var tabs = [
      <Tab label="Profil" >
        <Paper>
          <div className="profileDetails">

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
        </Paper>
      </Tab>,
      <Tab label="Aktywność" >
        <Paper>
          <div className="profileActivity">
            <h3 style={{display: is_owner ? 'block' : 'none'}}>Jesteś właścicielem tego profilu ☺</h3>
            <div style={{'display': 'inline-block'}}>
              <h3>Ostatnia aktywność:</h3>
            </div>
            <div className="activity"></div>
            <div className="activity"></div>
            <div className="activity"></div>
          </div>
        </Paper>
      </Tab>
    ]

    if (is_admin) {
      tabs.push(
        <Tab label="Komentarze" onActive={this.showProfileComments}>
          <ProfileComments volonteerId={this.props.id} adminId={user.id} context={this.props.context}></ProfileComments>
        </Tab>
      )
    }

    return (
      <Tabs tabItemContainerStyle={{'backgroundColor': 'rgba(0,0,0,0.1)'}}>
        {tabs}
      </Tabs>
    )
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
