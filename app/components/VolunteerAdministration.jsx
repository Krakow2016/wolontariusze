var React = require('react')
var Paper = require('material-ui/lib/paper')
var Button = require('material-ui/lib/raised-button')
var Dialog = require('material-ui/lib/dialog')

var VolunteerStore = require('../stores/Volunteer')
var updateVolunteer = require('../actions').updateVolunteer
var Invite = require('./Admin/Invite.jsx')

var VolunteerAdministration = React.createClass({
  getInitialState: function () {
    return {
      profile: this.props.context.getStore(VolunteerStore).getState().profile
    }
  },

  _changeListener: function() {
    this.setState({
      profile: this.props.context.getStore(VolunteerStore).getState().profile
    })
  },

  componentDidMount: function() {
    this.props.context.getStore(VolunteerStore)
      .addChangeListener(this._changeListener)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(VolunteerStore)
      .removeChangeListener(this._changeListener)
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
    var papers = [
      <Paper className="paper" key="info">
        <h1>{this.name()}</h1>
        <p>
          E-mail: {this.state.profile.email}
        </p>
      </Paper>
    ]

    if(this.state.profile.approved) {
      papers.push(
        <Paper className="paper" key="rejection">
          <p>Profil jest aktywny</p>
          <div style={{textAlign: 'center'}}>
            <Button label="Zablokuj profil" secondary={true} onClick={this.showRejectionDialog} />
          </div>
        </Paper>
      )
    } else {
      papers.push(
        <Invite id={this.state.profile.id} context={this.props.context} />
      )
    }

    if(this.state.profile.is_admin) {
    } else {
      papers.push(
        <Paper className="paper" key="admin">
          <p>Użytkownik nie posiada przywilejów administratora</p>
          <div style={{textAlign: 'center'}}>
            <Button label="Awansuj do rangi administratora" primary={true} onClick={this.showAdminDialog} />
          </div>
        </Paper>
      )
    }

    return (
      <div>
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
      </div>
    )
  },

  name: function() {
    return this.state.profile.first_name +' '+ this.state.profile.last_name
  },
})

module.exports = VolunteerAdministration
