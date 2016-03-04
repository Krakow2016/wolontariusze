var React = require('react')
var Snackbar = require('material-ui/lib/snackbar')

var Settings = require('./Settings.jsx')
var updateVolunteer = require('../../actions').updateVolunteer

var ProfileSettings = React.createClass({

  getInitialState: function () {
    return {
      canSubmit: false
    }
  },

  enableButton: function () {
    this.setState({
      canSubmit: true
    })
  },

  disableButton: function () {
    this.setState({
      canSubmit: false
    })
  },

  handleSubmit: function(data) {
    data.id = this.props.profileId
    this.props.context.executeAction(updateVolunteer, data)
  },

  render: function() {
    return (
      <Settings>
        <Formsy.Form className="settingsForm" onSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>

          {this.props.children}

          <div className="pure-g">
            <div className="pure-u-1 pure-u-md-1-3"></div>
            <div className="pure-u-1 pure-u-md-2-3">
              <button type="submit" className="button" disabled={!this.state.canSubmit}>
                Zmień
              </button>
              <div id="button-clear"></div>
            </div>
          </div>
        </Formsy.Form>
        <Snackbar
          open={!!this.props.success}
          message="Zapisano"
          autoHideDuration={5000}
          onRequestClose={this.props.handleSuccessSnackbarClose} />
        <Snackbar
          open={!!this.props.error}
          message="Wystąpił błąd"
          autoHideDuration={5000}
          onRequestClose={this.props.handleErrorSnackbarClose} />
      </Settings>
    )
  }
})

module.exports = ProfileSettings
