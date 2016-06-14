var React = require('react')

var actions = require('../../actions')

var Invite = React.createClass({

  propTypes: {
    context: React.PropTypes.object,
    id: React.PropTypes.string
  },

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
    window.location.hash = 'close'
  },

  render: function() {
    return (
      <div>
        <p>Profil jest nieaktywny do czasu, aż wolontariusz nie zostanie zaproszony do serwisu.</p>
        <div style={{textAlign: 'center'}}>
          <a href="#invite" className="button">Wyślij zaproszenie</a>
        </div>

        <div id="invite" className="modal">
          <div className="modal-container">
            <div className="modal-header">
              Potwierdzenie wymagane

              <a href="#close" className="modal-close">&times;</a>
            </div>

            <div className="modal-body">
              <p>
                Czy jesteś pewien aby zaprosić tego wolontariusza do portalu?
              </p>
            </div>

            <div className="modal-footer">
              <p>
                <button onClick={this._onDialogSubmit}>Tak</button>
                <a href="#close" className="button">Anuluj</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = Invite
