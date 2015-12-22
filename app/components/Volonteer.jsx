var React = require('react')
var NavLink = require('fluxible-router').NavLink

var VolonteerStore = require('../stores/Volonteer')

var Tabs = require('material-ui/lib/tabs/tabs')
var Tab =  require('material-ui/lib/tabs/tab')
var Paper = require('material-ui/lib/paper')
var Button = require('material-ui/lib/raised-button')

var ProfileComments = require('./ProfileComments.jsx')
var Invite = require('./Admin/Invite.jsx')

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
    var editLink
    var user = this.user()
    if(user && user.is_admin) {
      editLink = <NavLink href={"/wolontariusz/"+ this.state.id +"/admin"}>Edytuj</NavLink>
    }

    return (
      <div className="volonteer">
        <div className="pure-g volonteerHeader">
          <div className="pure-u-1 pure-u-sm-1-2">
            <img src="/img/profile.jpg" className="profilePicture" />
          </div>
          <div className="pure-u-1 pure-u-sm-1-2">
            <h1 className="fullName">{this.name()}</h1>
            <span>Kraków, Polska</span>
            {editLink}
          </div>
        </div>

        <ProfileTabs {...this.state} context={this.props.context} />

      </div>
    )
  },

  name: function() {
    return this.state.first_name +" "+ this.state.last_name
  },

  user: function() {
    return this.props.context.getUser()
  }
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

    var stars = {
        0: '☆☆☆☆☆',
        2: '★☆☆☆☆',
        4: '★★☆☆☆',
        6: '★★★☆☆',
        8: '★★★★☆',
        10:'★★★★★' }

    var languages = this.props.languages || {}
    var langs = Object.keys(languages).map(function(lang) {
      var level = languages[ lang ]
      return (
        <p key={lang}>
          {lang}: {stars[level.level]}
        </p>
      )
    })

    var profile_papers = [
      <Paper className="paper" key="details">
        <div className="profileDetails">

          <span>{this.props.city}</span>

          <div className="profileBio">

      <h4>Dane osobowe</h4>

      <p>
        Data urodzenia:
        {this.props.birth_date || 'n/a'}
      </p>

      <p>
        Telefon:
        {this.props.phone || 'n/a'}
      </p>

      <p>
        Parafia:
        {this.props.parish || 'n/a'}
      </p>

      <h4>Edukacja</h4>

      <p>
        Wykształcenie
        {this.props.eduction || 'n/a'}
      </p>

      <p>
        Kierunek
        {this.props.study_field || 'n/a'}
      </p>

      <h4>Doświadczenie</h4>
      <p>{this.props.experience || 'n/a'}</p>

      <h4>Zainteresowania</h4>
      <p>{this.props.interests || 'n/a'}</p>

      <h4>Gdzie chcę się zaangażować</h4>
      <p>{this.props.departments || 'n/a'}</p>

      <h4>Dostępność</h4>
      <p>{this.props.avalibitity || 'n/a'}</p>

          </div>
        </div>
      </Paper>,

      <Paper className="paper" key="langs">
        <h1>Języki</h1>
        {langs}
      </Paper>,

      <Paper className="paper" key="instagram">
        <h1>#sdm2016</h1>
        instagram
      </Paper>
    ]

    if (is_admin && !this.props.password) {
      profile_papers.unshift(
        <Invite id={this.props.id} context={this.props.context} />
      )
    }

    var tabs = [
      <Tab label="Profil" key="profile" >
        {profile_papers}
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
