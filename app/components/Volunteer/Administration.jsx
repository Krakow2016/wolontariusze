var React = require('react')
var VolunteerShell = require('./Shell.jsx')
var Comments = require('./Comments.jsx')
var update = require('react-addons-update')

var VolunteerStore = require('../../stores/Volunteer')
var XlsStore = require('../../stores/Xls')
var updateVolunteer = require('../../actions').updateVolunteer
var Invite = require('./Invite.jsx')
var Tags = require('../Tags/Tags.jsx')

var Details = React.createClass({

  render: function() {

    if(!this.props.id) {
      return (
        <div>
          Brak informacji o zgłoszeniu do wolontariatu krótkoterminowego.
        </div>
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

  render: function() {
    var papers = []
    var tags = this.state.profile.tags || []

    if(this.state.profile.approved) {
      papers.push(
        <div className="paper" key="rejection">
          <p>Profil jest aktywny</p>
          <div style={{textAlign: 'center'}}>
            <a href="#confirm" className="button">Zablokuj profil</a>
          </div>
        </div>
      )
    } else {
      papers.push(
        <Invite id={this.state.profile.id} context={this.props.context} />
      )
    }

    if(!this.state.profile.is_admin) {
      papers.push(
        <div className="paper" key="admin">
          <p>Użytkownik nie posiada przywilejów administratora</p>
          <div style={{textAlign: 'center'}}>
            <a href="#admin" className="button">Awansuj do rangi administratora</a>
          </div>
        </div>
      )
    }

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

              <b>Projekty: </b>
              <Tags data={tags} onSave={this.saveTag} onRemove={this.removeTag} />

            </div>
            <div className="col col5">
              <Comments context={this.props.context} />
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
                <strong>{this.state.profile.first_name} {this.state.profile.last_name}</strong> zyska prawa administratora. Czy jesteś pewien że chcesz to zrobić?
              </p>
            </div>

            <div className="modal-footer">
              <p>
                <button className="bg--error" onClick={this._onAdminDialogSubmit}>Tak, nadaj prawa administratora</button>
                <a href="#close" className="button">Anuluj</a>
              </p>
            </div>
          </div>
        </div>

      </VolunteerShell>
    )
  }
})

module.exports = VolunteerAdministration
