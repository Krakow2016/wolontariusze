var React = require('react')
var VolunteerShell = require('./Shell.jsx')
var Comments = require('../Comments/Comments.jsx')
var update = require('react-addons-update')
var moment = require('moment')

var VolunteerStore = require('../../stores/Volunteer')
var XlsStore = require('../../stores/Xls')
var removeVolunteerData = require('../../actions').removeVolunteerData
var updateVolunteer = require('../../actions').updateVolunteer
var Invite = require('./Invite.jsx')
var Tags = require('../Tags/Tags.jsx')

var Details = React.createClass({

  render: function() {

    if(!this.props.id) {
      return (
        <p>
          Brak informacji o zgłoszeniu do wolontariatu krótkoterminowego.
        </p>
      )
    }

    var props = this.props
    var rows = Object.keys(this.props).map(function(key){
      return (
        <tr key={key}>
          <td>{key}</td>
          <td>{props[key]}</td>
        </tr>
      )
    })

    return (
      <table className="details">
        <tr>
          <th>Klucz</th>
          <th>Wartość</th>
        </tr>
        {rows}
      </table>
    )
  }
})

var VolunteerAdministration = React.createClass({

  propTypes: {
    context: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      profile: this.props.context.getStore(VolunteerStore).getState().profile,
      details: this.props.context.getStore(XlsStore).data
    }
  },

  _changeListener: function() {
    this.replaceState({
      profile: this.props.context.getStore(VolunteerStore).getState().profile
    })
  },

  _changeListener2: function() {
    this.setState({
      details: this.props.context.getStore(XlsStore).data
    })
  },

  componentDidMount: function() {
    this.props.context.getStore(VolunteerStore)
      .addChangeListener(this._changeListener)

    this.props.context.getStore(XlsStore)
      .addChangeListener(this._changeListener2)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(VolunteerStore)
      .removeChangeListener(this._changeListener)

    this.props.context.getStore(XlsStore)
      .removeChangeListener(this._changeListener2)
  },

  _onRemoveDataDialogSubmit: function() {
    this.props.context.executeAction(removeVolunteerData, {
      id: this.state.profile.id,
      email: this.state.profile.email
    })
    window.location.hash = 'close'
  },

  _onRejectionDialogSubmit: function() {
    this.props.context.executeAction(updateVolunteer, {
      id: this.state.profile.id,
      approved: false
    })
    window.location.hash = 'close'
  },

  _onAdminDialogSubmit: function() {
    this.props.context.executeAction(updateVolunteer, {
      id: this.state.profile.id,
      is_admin: true
    })
    window.location.hash = 'close'
  },
  _onAdminRejectDialogSubmit: function() {
    this.props.context.executeAction(updateVolunteer, {
      id: this.state.profile.id,
      is_admin: false
    })
    window.location.hash = 'close'
  },
  _onLeaderDialogSubmit: function() {
    this.props.context.executeAction(updateVolunteer, {
      id: this.state.profile.id,
      is_leader: true
    })
    window.location.hash = 'close'
  },
  _onLeaderRejectDialogSubmit: function() {
    this.props.context.executeAction(updateVolunteer, {
      id: this.state.profile.id,
      is_leader: false
    })
    window.location.hash = 'close'
  },
  saveTag: function(tag) {
    var tags = this.state.profile.tags || []
    this.props.context.executeAction(updateVolunteer, {
      id: this.state.profile.id,
      tags: tags.concat(tag)
    })
  },

  removeTag: function(e) {
    var tag = e.target.dataset.tag
    var index = this.state.profile.tags.indexOf(tag)
    var state = update(this.state, {
      profile: {
        tags: {$splice: [[index, 1]]}
      }
    })

    this.props.context.executeAction(updateVolunteer, {
      id: state.profile.id,
      tags: state.profile.tags
    })
  },

  onResponsibilitiesChange: function(e) {
    var value = e.target.value
    this.setState(update(this.state, {
      profile: {responsibilities: {$set: value}}
    }))
  },

  updateResponsibilities: function() {
    this.props.context.executeAction(updateVolunteer, {
      id: this.state.profile.id,
      responsibilities: this.state.profile.responsibilities
    })
  },

  render: function() {
    var papers = []
    var tags = this.state.profile.tags || []
    var approved_at = this.state.profile.approved_at ? moment(this.state.profile.approved_at).calendar() : 'niewiadomo kiedy'

    if(this.state.profile.email) {
      papers.push(
        <div className="card" key="removeData">
          <div className="card-content text--center">
            <h3>Uwaga!</h3>
            <p>Naciśnięcie tego przycisku spowoduje usunięcie danych wolontariusza z bazy danych (Operacja nieodwracalna)</p>
            <div style={{textAlign: 'center'}}>
              <a href="#removeData" className="button">Usuń dane</a>
            </div>
          </div>
        </div>
      )
    }
    if(this.state.profile.approved) {
      papers.push(
        <div className="card" key="invitation">
          <div className="card-content text--center">
            <p>Profil jest aktywny (zaproszenie wysłano { approved_at })</p>
            <div style={{textAlign: 'center'}}>
              <a href="#confirm" className="button">Zablokuj profil</a>
            </div>
          </div>
        </div>
      )
    } else {
      papers.push(
        <div className="card" key="invitation">
          <div className="card-content text--center">
            <Invite id={this.state.profile.id} context={this.props.context} />
          </div>
        </div>
      )
    }

    if(this.state.profile.has_password) {
      papers.push(
        <div className="card" key="password">
          <div className="card-content text--center">
            <p>Wolontariusz aktywował swoje konto i może się logować.</p>
          </div>
        </div>
      )
    } else {
      papers.push(
        <div className="card" key="password">
          <div className="card-content text--center">
            <p>Wolontariusz nie aktywował swojego konta!</p>
          </div>
        </div>
      )
    }

    if(!this.state.profile.is_admin) {
      papers.push(
        <div className="card" key="admin">
          <div className="card-content text--center">
            <p>Użytkownik nie posiada przywilejów administratora</p>
            <div style={{textAlign: 'center'}}>
              <a href="#admin" className="button">Awansuj do rangi administratora</a>
            </div>
          </div>
        </div>
      )
    } else {
      papers.push(
        <div className="card" key="admin">
          <div className="card-content">
            Konto ma uprawnienia administratora (<a href="#reject_admin">kliknij tutaj aby odebrać</a>).
            <textarea
              placeholder="Zakres obowiązków w wolontariacie"
              onChange={this.onResponsibilitiesChange}
              value={this.state.profile.responsibilities} />
            <p className="text--right">
              <button onClick={this.updateResponsibilities}>Aktualizuj</button>
            </p>
          </div>
        </div>
      )
    }

    if(!this.state.profile.is_leader) {
      papers.push(
        <div className="card" key="leader">
          <div className="card-content text--center">
            <p>Użytkownik nie posiada przywilejów lidera</p>
            <div style={{textAlign: 'center'}}>
              <a href="#leader" className="button">Awansuj do rangi lidera</a>
            </div>
          </div>
        </div>
      )
    } else {
      papers.push(
        <div className="card" key="leader">
          <div className="card-content text--center">
            <p>Konto ma uprawnienia lidera</p>
            <div style={{textAlign: 'center'}}>
              <a href="#reject_leader" className="button">Odbierz prawa lidera</a>
            </div>
          </div>
        </div>
      )
    }
    
    if (this.state.profile.email) {
      return (
            <VolunteerShell context={this.props.context} profile={this.state.profile}>

              <div className="alert alert--warning">
                <p>
                  <strong>Uwaga!</strong> Ta strona jest do wglądu wyłącznie dla
                  koordynatorów.  Korzystając z niej zobowiązujesz się do zachowania w
                  tajemnicy i nie ujawniania osobom trzecim otrzymanych tu informacji i
                  danych osobowych o charakterze poufnym.
                </p>
              </div>

              <div className="container">
                <div className="row">
                  <div className="col col7">

                    {papers}

                    <Details {...this.state.details} />

                    <div className="card" key="projects">
                      <div className="card-content">
                        <b>Projekty: </b>
                        <Tags data={tags} onSave={this.saveTag} onRemove={this.removeTag} />
                      </div>
                    </div>

                  </div>
                  <div className="col col5">
                    <Comments context={this.props.context} />
                  </div>

                </div>
              </div>

              <div id="removeData" className="modal">
                <div className="modal-container">
                  <div className="modal-header">
                    Potwierdzenie wymagane

                    <a href="#close" className="modal-close">&times;</a>
                  </div>

                  <div className="modal-body">
                    <p>
                      Czy jesteś pewien, że chcesz usunąć dane wolontariusza z bazy danych ?
                    </p>
                  </div>

                  <div className="modal-footer">
                    <p>
                      <button onClick={this._onRemoveDataDialogSubmit}>Tak</button>
                      <a href="#close" className="button">Anuluj</a>
                    </p>
                  </div>
                </div>
              </div>

              <div id="confirm" className="modal">
                <div className="modal-container">
                  <div className="modal-header">
                    Potwierdzenie wymagane

                    <a href="#close" className="modal-close">&times;</a>
                  </div>

                  <div className="modal-body">
                    <p>
                      Czy jesteś pewien?
                    </p>
                  </div>

                  <div className="modal-footer">
                    <p>
                      <button onClick={this._onRejectionDialogSubmit}>Tak</button>
                      <a href="#close" className="button">Anuluj</a>
                    </p>
                  </div>
                </div>
              </div>

              <div id="admin" className="modal">
                <div className="modal-container">
                  <div className="modal-header">
                    Czy jesteś pewien?

                    <a href="#close" className="modal-close">&times;</a>
                  </div>

                  <div className="modal-body">
                    <p>
                      <strong>{this.state.profile.first_name} {this.state.profile.last_name}</strong> zyska prawa koordynatora. Czy jesteś pewien że chcesz to zrobić?
                    </p>
                  </div>

                  <div className="modal-footer">
                    <p>
                      <button className="bg--error" onClick={this._onAdminDialogSubmit}>Tak, nadaj prawa koordynatora</button>
                      <a href="#close" className="button">Anuluj</a>
                    </p>
                  </div>
                </div>
              </div>

              <div id="reject_admin" className="modal">
                <div className="modal-container">
                  <div className="modal-header">
                    Czy jesteś pewien?

                    <a href="#close" className="modal-close">&times;</a>
                  </div>

                  <div className="modal-body">
                    <p>
                      <strong>{this.state.profile.first_name} {this.state.profile.last_name}</strong> straci prawa koordynatora. Czy jesteś pewien że chcesz to zrobić?
                    </p>
                  </div>

                  <div className="modal-footer">
                    <p>
                      <button className="bg--error" onClick={this._onAdminRejectDialogSubmit}>Tak, usuń prawa koordynatora</button>
                      <a href="#close" className="button">Anuluj</a>
                    </p>
                  </div>
                </div>
              </div>

              <div id="leader" className="modal">
                <div className="modal-container">
                  <div className="modal-header">
                    Czy jesteś pewien?

                    <a href="#close" className="modal-close">&times;</a>
                  </div>

                  <div className="modal-body">
                    <p>
                      <strong>{this.state.profile.first_name} {this.state.profile.last_name}</strong> zyska prawa lidera. Czy jesteś pewien że chcesz to zrobić?
                    </p>
                  </div>

                  <div className="modal-footer">
                    <p>
                      <button className="bg--error" onClick={this._onLeaderDialogSubmit}>Tak, nadaj prawa lidera</button>
                      <a href="#close" className="button">Anuluj</a>
                    </p>
                  </div>
                </div>
              </div>

              <div id="reject_leader" className="modal">
                <div className="modal-container">
                  <div className="modal-header">
                    Czy jesteś pewien?

                    <a href="#close" className="modal-close">&times;</a>
                  </div>

                  <div className="modal-body">
                    <p>
                      <strong>{this.state.profile.first_name} {this.state.profile.last_name}</strong> straci prawa lidera. Czy jesteś pewien że chcesz to zrobić?
                    </p>
                  </div>

                  <div className="modal-footer">
                    <p>
                      <button className="bg--error" onClick={this._onLeaderRejectDialogSubmit}>Tak, usuń prawa lidera</button>
                      <a href="#close" className="button">Anuluj</a>
                    </p>
                  </div>
                </div>
              </div>

            </VolunteerShell>
          )
    } else {
      return (
            <VolunteerShell context={this.props.context} profile={this.state.profile}>

              <div className="alert alert--warning">
                <p>
                  <strong>Uwaga!</strong> Dane użytkownika zostały usunięte z bazy danych.
                </p>
              </div>

            </VolunteerShell>
      )
    }
    
  }
})

module.exports = VolunteerAdministration
