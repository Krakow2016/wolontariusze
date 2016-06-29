var React = require('react')
var NavLink = require('fluxible-router').NavLink
var ProfilePic = require('../ProfilePic.jsx')

var ActivitiesStore = require('../../stores/Activities.js')

var Volunteer = React.createClass({

  propTypes: {
    children: React.PropTypes.element,
    context: React.PropTypes.object,
    profile: React.PropTypes.object
  },

  getInitialState: function () {
    // TODO ActivitiesStore nie zawsze jest zainicjalizowany
    return {
      activities: this.props.context.getStore(ActivitiesStore).dehydrate()
    }
  },

  _changeListener: function() {
    this.setState({
      activities: this.props.context.getStore(ActivitiesStore).dehydrate()
    })
  },

  componentDidMount: function() {
    this.props.context.getStore(ActivitiesStore)
      .addChangeListener(this._changeListener)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(ActivitiesStore)
      .removeChangeListener(this._changeListener)
  },


  render: function () {
    var user = this.user()
    // TODO: to nie są wszystkie aktywności, tylko 10 ostatnich
    var all = this.state.activities ? this.state.activities.all : []

    var email
    var tabs = [
      <NavLink key="profile" href={'/wolontariusz/' + this.props.profile.id} className="profile-ribon-cell">
        <b id="profile-ribon-txt">Profil</b>
      </NavLink>,
      <NavLink key="activities" href={'/wolontariusz/' + this.props.profile.id +'/aktywnosci'} className="profile-ribon-cell">
        <b id="profile-ribon-txt">Aktywności</b>
      </NavLink>
    ]

    if(user) {
      tabs.push(
        <NavLink key="schedule" href={'/wolontariusz/' + this.props.profile.id +'/grafik'} className="profile-ribon-cell">
          <b id="profile-ribon-txt">Grafik</b>
        </NavLink>
      )
      if(user.is_admin) {
        tabs.push(
          <NavLink key="details" href={'/wolontariusz/' + this.props.profile.id +'/admin'} className="profile-ribon-cell">
            <b id="profile-ribon-txt">Szczegóły</b>
          </NavLink>
        )

        email = (
          <h3>
            <b>E-mail: </b>
            <span>
              <a href={'mailto:'+ this.props.profile.email} target="_blank" id="prolife-data-mail">
                {this.props.profile.email}
              </a>
            </span>
          </h3>
        )
      }
    }

    var tags
    if(this.props.profile.tags) {
      tags = (<div className="row">
                <p className="prolife-stone-header">PROJEKTY</p>
                <img className="prolife-stone-img" src="/img/homepage/bialy_tag.svg" />
                <span id="stone-tag" className="prolife-stone-text">{ this.props.profile.tags.join(', ') }</span>
              </div>)
    }

    return (
      <div className="volunteer">
        <section className="section row vcard">
          <div className="col col4">
            <ProfilePic src={this.props.profile.profile_picture_url} className="prolife-photo" />
          </div>
          <div className="col col4 prolife-data">
            <h1 className="profile-name">{this.name()}</h1>
            <h3><b>Kraj:</b> <span>{ this.props.profile.nationality || 'Polska' }</span></h3>
            {email}
          </div>
          <div className="col col4 prolife-stone">
              <div className="row">
                <p className="prolife-stone-header">WYKONANE ZADANIA</p>
                <img className="prolife-stone-img" src="/img/homepage/biale_buty.svg" />
                <span className="prolife-stone-text prolife-stone-number">{all.length}</span>
              </div>
              {tags}
          </div>
        </section>

        <div className="profile-row row">
          <div className="col col12 profile-ribon">
            {tabs}
          </div>
        </div>

        {this.props.children}
      </div>
    )
  },

  name: function() {
    return this.props.profile.first_name +' '+ this.props.profile.last_name
  },

  user: function() {
    return this.props.context.getUser()
  }
})



//var ProfileTabs = React.createClass({

  //render: function() {

    ////var extra
    ////var user = this.user()
    ////var is_owner = user && user.id === this.props.id
    ////var is_admin = user && user.is_admin
    ////if (is_admin || is_owner) {
      ////extra = <ExtraAttributesVisible {...this.props} />
    ////} else {
      ////extra = <div />
    ////}

    ////var stars = {
      ////0: '☆☆☆☆☆',
      ////2: '★☆☆☆☆',
      ////4: '★★☆☆☆',
      ////6: '★★★☆☆',
      ////8: '★★★★☆',
      ////10:'★★★★★' }

    ////var languages = this.props.languages || {}
    ////var langs = Object.keys(languages).map(function(lang) {
      ////var level = languages[ lang ]
      ////return (
        ////<p key={lang}>
          ////{lang}: {stars[level.level]}
        ////</p>
      ////)
    ////})

    ////var profile_papers = [
      ////<Paper className="paper" key="details">
        ////<div className="profileDetails">

          ////<span>{this.props.city}</span>

          ////<div className="profileBio">

      ////<h4>Dane osobowe</h4>

      ////<p>
        ////Data urodzenia:
        ////{this.props.birth_date || 'n/a'}
      ////</p>

      ////<p>
        ////Telefon:
        ////{this.props.phone || 'n/a'}
      ////</p>

      ////<p>
        ////Parafia:
        ////{this.props.parish || 'n/a'}
      ////</p>

      ////<h4>Edukacja</h4>

      ////<p>
        ////Wykształcenie
        ////{this.props.eduction || 'n/a'}
      ////</p>

      ////<p>
        ////Kierunek
        ////{this.props.study_field || 'n/a'}
      ////</p>

      ////<h4>Doświadczenie</h4>
      ////<p>{this.props.experience || 'n/a'}</p>

      ////<h4>Zainteresowania</h4>
      ////<p>{this.props.interests || 'n/a'}</p>

      ////<h4>Gdzie chcę się zaangażować</h4>
      ////<p>{this.props.departments || 'n/a'}</p>

      ////<h4>Dostępność</h4>
      ////<p>{this.props.avalibitity || 'n/a'}</p>

          ////</div>
        ////</div>
      ////</Paper>,

      ////<Paper className="paper" key="langs">
        ////<h1>Języki</h1>
        ////{langs}
      ////</Paper>,

      ////<Paper className="paper" key="instagram">
        ////<h1>#sdm2016</h1>
        ////instagram
      ////</Paper>
    ////]

//})

//var ExtraAttributesVisible = React.createClass({
  //render: function() {
    //return(
      //<p style={{color: 'red'}}><b>Doświadczenie </b>{this.props.experience}</p>
    //)
  //}
//})

// Module.exports instead of normal dom mounting
module.exports = Volunteer
