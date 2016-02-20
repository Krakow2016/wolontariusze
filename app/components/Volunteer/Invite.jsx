var React = require('react')
var Button = require('material-ui/lib/raised-button')
var Dialog = require('material-ui/lib/dialog')

var actions = require('../../actions')

var Invite = React.createClass({

  getInitialState: function () {
    return {}
  },

  showDialog: function() {
    this.setState({openDialog: true})
  },

  _handleRequestClose: function() {
    this.setState({openDialog: false})
  },

  _onDialogSubmit: function() {
    this.props.context.executeAction(actions.inviteUser, {
      id: this.props.id
    })
    this._handleRequestClose()
  },

  render: function() {
    return (
      <div>
        <p>Profil jest nieaktywny do czasu, aż wolontariusz nie zostanie zaproszony do serwisu.</p>
        <div style={{textAlign: 'center'}}>
          <Button label="Wyślij zaproszenie" secondary={true} onClick={this.showDialog} />
        </div>

        <Dialog
           ref="dialog"
          title="Potwierdź"
          actions={[ { text: 'Cancel' }, { text: 'Submit', onTouchTap: this._onDialogSubmit, ref: 'submit' } ]}
          actionFocus="submit"
          open={this.state.openDialog}
          onRequestClose={this._handleRequestClose} >
          Czy jesteś pewnien aby to zrobić?
        </Dialog>
      </div>
    )
  }
})

module.exports = Invite
