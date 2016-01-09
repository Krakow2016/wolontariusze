var React = require('react')

var Settings = require('./Settings.jsx')
var MyTextField = require('./MyTextField.jsx')
var createAPIClient = require('../../actions').createAPIClient

var Develop = React.createClass({

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
    this.props.context.executeAction(createAPIClient, data)
  },

  render: function() {
    return (
      <Settings>
        <Formsy.Form className="settingsForm" onSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>
          <div className="pure-g">
            <div className="pure-u-1 pure-u-md-1-3">
              <label htmlFor="first_name">Nazwa</label>
            </div>
            <div className="pure-u-1 pure-u-md-2-3">
              <MyTextField required
                id="name"
                name="name"
                placeholder="Moja aplikacja"
                validations="minLength:3"
                validationError="Nazwa jest wymagana" />
            </div>
          </div>

          <div className="pure-g">
            <div className="pure-u-1 pure-u-md-1-3">
              <label htmlFor="first_name">Adres zwrotny URL</label>
            </div>
            <div className="pure-u-1 pure-u-md-2-3">
              <MyTextField required
                id="callback_url"
                name="callback_url"
                placeholder="http://"
                validations="minLength:3"
                validationError="URL jest wymagany" />
            </div>
          </div>

          <button type="submit" className="pure-button pure-button-primary" disabled={!this.state.canSubmit}>
            Stwórz
          </button>
        </Formsy.Form>
      </Settings>
    )
  }
})

module.exports = Develop
