var React = require('react')

var updateVolonteer = require('../../actions').updateVolonteer

var ProfileSettings = React.createClass({

  getInitialState: function () {
    return {
      canSubmit: false
    }
  },

  enableButton: function () {
    this.setState({
      canSubmit: true
    });
  },

  disableButton: function () {
    this.setState({
      canSubmit: false
    });
  },

  handleSubmit: function(data) {
    data.id = this.props.profileId
    this.props.context.executeAction(updateVolonteer, data)
  },

  render: function() {
    return (
      <Formsy.Form className="settingsForm" onSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>

        {this.props.children}

        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1-3"></div>
          <div className="pure-u-1 pure-u-md-2-3">
            <button type="submit" className="pure-button pure-button-primary" disabled={!this.state.canSubmit}>
              Zmień
            </button>
          </div>
        </div>
      </Formsy.Form>
    )
  }
})

module.exports = ProfileSettings
