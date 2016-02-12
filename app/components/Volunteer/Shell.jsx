var React = require('react')
var NavLink = require('fluxible-router').NavLink

var VolunteerStore = require('../../stores/Volunteer')

var actions = require('../../actions')

var Volunteer = React.createClass({

  getInitialState: function () {
    return this.props.context.getStore(VolunteerStore).getState().profile
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(VolunteerStore).getState().profile)
  },

  componentDidMount: function() {
    this.props.context.getStore(VolunteerStore)
      .addChangeListener(this._changeListener)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(VolunteerStore)
      .removeChangeListener(this._changeListener)
  },

  render: function () {
    var user = this.user()

    var email
    var tabs = [
      <NavLink href={"/wolontariusz/" + this.state.id} className="profile-ribon-cell">
        <b id="profile-ribon-txt">Profil</b>
      </NavLink>,
      <NavLink href={"/wolontariusz/" + this.state.id +'/aktywnosci'} className="profile-ribon-cell">
        <b id="profile-ribon-txt">Aktywności</b>
      </NavLink>
    ]

    if(user) {
      tabs.push(
        <NavLink href={"/wolontariusz/" + this.state.id +'/grafik'} className="profile-ribon-cell">
          <b id="profile-ribon-txt">Grafik</b>
        </NavLink>
      )
      if(user.is_admin) {
        tabs.push(
          <NavLink href={"/wolontariusz/" + this.state.id +'/admin'} className="profile-ribon-cell">
            <b id="profile-ribon-txt">Szczegóły</b>
          </NavLink>
        )

        email = (
          <h2>
            <b>E-mail: </b>
            <span>
              <a href={"mailto:"+ this.state.email} target="_blank">
                {this.state.email}
              </a>
            </span>
          </h2>
        )
      }
    }

    return (
      <div className="volonteer">
        <div className="section group">
          <div className="col span_2_of_4">
            <img src={this.state.profile_picture_url} id="prolife-photo" />
          </div>
          <div className="col span_2_of_4">
            <h1 className="profile-name">{this.name()}</h1>
            <h2><b>Kraj:</b> <span>Polska</span></h2>
            {email}
          </div>
        </div>

        <div className="section group">
          <div className="col span_4_of_4 profile-ribon">
            {tabs}
          </div>
        </div>

        {this.props.children}
      </div>
    )
          //<div className="col span_1_of_4">
            //<p id="profile-grow-title"><b>Lorem sprawił/a, że Góra Dobra urosła o</b></p>
          //</div>
          //<div className="col span_1_of_4" id="profile-stone-box">
            //<img src="/img/profile/stone.svg" id="prolife-stone-img" />
            //<p id="profile-stone-tasks">
              //<b id="profile-stone-tasks-nr">100</b><br />
              //<b>zadań</b>
            //</p>
          //</div>

          //<div className="col span_2_of_4">
            //<img src="/img/profile/phone.svg" id="prolife-contant-ico"/>
            //<div>
              //<h2 id="prolife-contant-data">0048 777 888 999</h2>
            //</div>
          //</div>
  },

  name: function() {
    return this.state.first_name +' '+ this.state.last_name
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

var ExtraAttributesVisible = React.createClass({
  render: function() {
    return(
      <p style={{color: 'red'}}><b>Doświadczenie </b>{this.props.experience}</p>
    )
  }
})

// Module.exports instead of normal dom mounting
module.exports = Volunteer

