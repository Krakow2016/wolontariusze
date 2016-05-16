var React = require('react')
var NavLink = require('fluxible-router').NavLink

var Volunteer = React.createClass({

  propTypes: {
    children: React.PropTypes.element,
    context: React.PropTypes.object,
    profile: React.PropTypes.object
  },

  render: function () {
    var user = this.user()

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
          <h2>
            <b>E-mail: </b>
            <span>
              <a href={'mailto:'+ this.props.profile.email} target="_blank">
                {this.props.profile.email}
              </a>
            </span>
          </h2>
        )
      }
    }

    var tags
    if(this.props.profile.tags) {
      tags = (<h2><b>Tagi:</b> <span>{ this.props.profile.tags.join(', ') }</span></h2>)
    }
    
    //Jeżeli użytkownik jest zalogowany lub profil jest dostępny publicznie -- to pokazujemy profil
    if (user || this.props.profile.profile_visible) {
      return (
        <div className="volonteer">
          <div className="section row">
            <div className="col col6">
              <img src={this.props.profile.profile_picture_url} id="prolife-photo" />
            </div>
            <div className="col col6">
              <h1 className="profile-name">{this.name()}</h1>
              <h2><b>Kraj:</b> <span>{ this.props.profile.nationality || 'Polska' }</span></h2>
              {tags}
              {email}
            </div>
          </div>

          <div className="section row">
            <div className="col col12 profile-ribon">
              {tabs}
            </div>
          </div>

          {this.props.children}
        </div>
      )
    } else {
      return (
          //Zwraca domyślne foto - buźkę :)
          <div className="section row">
            <div className="col col12">
              <img src='/img/profile/face.svg' id="prolife-photo" />
              <h2 style={{textAlign: 'center'}}>Profil niedostępny</h2>
            </div>
          </div>
      )
    }
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
