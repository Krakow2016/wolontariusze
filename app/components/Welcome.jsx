var React = require('react')
var NavLink = require('fluxible-router').NavLink
var navigateAction = require('fluxible-router').navigateAction
var Formsy = require('formsy-react')
var FormattedMessage = require('react-intl').FormattedMessage

var Password = require('./Settings/Password.jsx')
var MyCheckbox = require('./Formsy/MyCheckbox.jsx')
var updateVolunteer = require('../actions').updateVolunteer
var VolunteerStore = require('../stores/Volunteer')
var Disclamer = require('./Settings/Disclamer.jsx')

var Welcome = React.createClass({

  propTypes: {
    context: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      profile: this.props.context.getStore(VolunteerStore).getState().profile,
      canSubmit: false,
      // Zablokuj możliwość wpisywania hasła do czasu aż strona nie załduje skryptów
      hasLoaded: false
    }
  },

  _changeListener: function() {
    if(this.props.context.getStore(VolunteerStore).getState().success) {
      // Hasło zostało zmienione
      this.props.context.executeAction(navigateAction, {
        type: 'replacestate',
        url: '/ustawienia'
      })
    }
  },

  componentDidMount: function() {
    this.props.context.getStore(VolunteerStore).addChangeListener(this._changeListener)
    this.setState({
      hasLoaded: true
    })
  },

  componentWillUnmount: function componentWillUnmount() {
    // Usuń funkcję nasłychującą
    this.props.context.getStore(VolunteerStore)
      .removeChangeListener(this._changeListener)
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
    data.id = this.state.profile.id
    this.props.context.executeAction(updateVolunteer, data)
  },

  render: function() {
    var spinner

    if (!this.state.hasLoaded) {
      spinner = <div className="spinner" />
    }

    return (
      <div>
        <Formsy.Form className="settingsForm" onSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>
          <FormattedMessage id="welcome_" tagName="h2" />

          <Disclamer />

          <hr />

          <FormattedMessage id="welcome_password" tagName="h4" />

          <div className="alert">

            {spinner}

            <Password disabled={!this.state.hasLoaded} />

            <div>
              <MyCheckbox required="isFalse"
                id="cb1"
                name="cb1" value={false} />
              <label htmlFor="cb1">
                <FormattedMessage id="welcome_agreement1" />{' '}
                <NavLink href="/regulamin">
                  <FormattedMessage id="welcome_agreement1_link" />
                </NavLink>
              </label>

            </div>

            <div>
              <MyCheckbox required="isFalse"
                id="cb2"
                name="cb2" value={false} />

              <label htmlFor="cb2">
                <FormattedMessage id="welcome_agreement2" />
              </label>

              <FormattedMessage id="welcome_agreement2_details" tagName="p" />
            </div>
            <div>
              <MyCheckbox required="isFalse"
                id="cb3"
                name="cb3" value={false} />

              <label htmlFor="cb3">
                <FormattedMessage id="welcome_agreement3" />
              </label>

              <FormattedMessage id="welcome_agreement3_details" tagName="p" />
            </div>

            <button type="submit" className="pure-button pure-button-primary" disabled={!this.state.canSubmit}>
              <FormattedMessage id="continue" />
            </button>
          </div>
        </Formsy.Form>
      </div>
    )
  }
})

module.exports = Welcome
