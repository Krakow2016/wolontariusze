var React = require('react')
var VolunteerShell = require('./Shell.jsx')
var Comments = require('./Comments.jsx')

var Button = require('material-ui/lib/raised-button')
var Dialog = require('material-ui/lib/dialog')

var VolunteerStore = require('../../stores/Volunteer')
var XlsStore = require('../../stores/Xls')
var updateVolunteer = require('../../actions').updateVolunteer
var Invite = require('./Invite.jsx')

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
    this.setState({
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

  showRejectionDialog: function() {
    this.setState({openRejectionDialog: true})
  },

  showAdminDialog: function() {
    this.setState({openAdminDialog: true})
  },

  _onRejectionDialogSubmit: function() {
    this.props.context.executeAction(updateVolunteer, {
      id: this.state.profile.id,
      approved: false
    })
    this._handleRequestClose()
  },

  _onAdminDialogSubmit: function() {
    this.props.context.executeAction(updateVolunteer, {
      id: this.state.profile.id,
      is_admin: true
    })
    this._handleRequestClose()
  },

  _handleRequestClose: function() {
    this.setState({
      openRejectionDialog: false,
      openAdminDialog: false
    })
  },

  render: function() {
    var papers = []

    if(this.state.profile.approved) {
      papers.push(
        <div className="paper" key="rejection">
          <p>Profil jest aktywny</p>
          <div style={{textAlign: 'center'}}>
            <Button label="Zablokuj profil" secondary={true} onClick={this.showRejectionDialog} />
          </div>
        </div>
      )
    } else {
      papers.push(
        <Invite id={this.state.profile.id} context={this.props.context} />
      )
    }

    if(this.state.profile.is_admin) {
    } else {
      papers.push(
        <div className="paper" key="admin">
          <p>Użytkownik nie posiada przywilejów administratora</p>
          <div style={{textAlign: 'center'}}>
            <Button label="Awansuj do rangi administratora" primary={true} onClick={this.showAdminDialog} />
          </div>
        </div>
      )
    }

    return (
      <VolunteerShell context={this.props.context}>
        {papers}

        <Dialog
          ref="rejection_dialog"
          title="Potwierdź"
          actions={[ { text: 'Cancel' }, { text: 'Submit', onTouchTap: this._onRejectionDialogSubmit, ref: 'submit' } ]}
          actionFocus="submit"
          open={this.state.openRejectionDialog}
          onRequestClose={this._handleRequestClose} >
          Czy jesteś pewnien aby to zrobić?
        </Dialog>

        <Dialog
          ref="admin_dialog"
          title="Potwierdź"
          actions={[ { text: 'Cancel' }, { text: 'Submit', onTouchTap: this._onAdminDialogSubmit, ref: 'submit' } ]}
          actionFocus="submit"
          open={this.state.openAdminDialog}
          onRequestClose={this._handleRequestClose} >
          Czy jesteś pewnien aby to zrobić?
        </Dialog>

        <Details {...this.state.details} />

        <Comments context={this.props.context} />
      </VolunteerShell>
    )
  }
})

module.exports = VolunteerAdministration
