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
    return this.props.context.getStore(VolonteerStore).getState().profile
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(VolonteerStore).getState().profile)
  },

  componentDidMount: function() {
    this.props.context.getStore(VolonteerStore)
      .addChangeListener(this._changeListener);
  },

  componentWillUnmount: function() {
    this.props.context.getStore(VolonteerStore)
      .removeChangeListener(this._changeListener);
  },

  render: function () {
    return (
      <div className="volonteer">
        <div className="pure-g volonteerHeader">
          <div className="pure-u-1-2">
            <img src="/img/profile.jpg" className="profilePicture" />
          </div>
          <div className="pure-u-1-2">
            <h1>{this.name()}</h1>
            <span>Kraków, Polska</span>
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
      <Tab label="Profil" key="profile" >
        <Paper className="paper">
          <div className="profileDetails">

            <span>{this.props.city}</span>

            <div className="profileBio">
              <p><b>Interesuje mnie </b>{this.props.interests}</p>
              <p><b>Chcę się angażować w </b>{this.props.departments}</p>
              <p><b>Moim wielkim marzeniem jest </b>{this.props.my_dream}</p>
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
              {extra}
            </div>
          </div>
        </Paper>

        <Paper className="paper">
            <h1>Języki</h1>
            lulz
        </Paper>

        <Paper className="paper">
            <h1>#sdm2016</h1>
            lulz
        </Paper>
      </Tab>,
      <Tab label="Aktywność" key="activity" >
        <Paper className="paper">
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
        <Tab label="Komentarze" key="comments" onActive={this.showProfileComments}>
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
