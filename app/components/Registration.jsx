var React = require('react')
var Formsy = require('formsy-react')

var VolunteerStore = require('../stores/Volunteer')
var createVolunteer = require('../actions').createVolunteer

var BasicForm = require('./Settings/BasicForm.jsx')

var MyInput = React.createClass({

  // Add the Formsy Mixin
  mixins: [Formsy.Mixin],

  // setValue() will set the value of the component, which in
  // turn will validate it and the rest of the form
  changeValue: function(event) {
    this.setValue(event.currentTarget.value)
  },

  render: function() {

    // An error message is returned ONLY if the component is invalid
    // or the server has returned an error message
    var errorMessage = this.getErrorMessage()

    return (<input id={this.props.id} type={this.props.type} onChange={this.changeValue} errorText={errorMessage}/>)
  }
})

var Registration = React.createClass({

  propTypes: {
    context: React.PropTypes.object
  },

  getInitialState: function() {
    return {}
  },

  componentDidMount: function componentDidMount() {
    // Nasłuchuj zmiań na zasobie wolontariusza. Nastąpi ona po zapisaniu
    // go w bazie danych.
    this.props.context.getStore(VolunteerStore).addChangeListener(this._onStoreChange)
  },

  componentWillUnmount: function componentWillUnmount() {
    // Usuń funkcję nasłychującą.
    this.props.context.getStore(VolunteerStore).removeChangeListener(this._onStoreChange)
  },

  _onStoreChange: function() {
    // Nastąpiła zmiana w stanie zasobu wolontariusza - uaktualij widok.
    var volunteer = this.props.context.getStore(VolunteerStore).getState()
    this.setState(volunteer)
  },

  render: function() {
    if (this.state.success) {
      return (
        <p>Dziękujemy za zgłoszenie!</p>
      )
    } else {
      return (<RegistrationForm context={this.props.context} error={this.state.error}/>)
    }
  }
})

var RegistrationForm = React.createClass({

  getInitialState: function() {
    return {canSubmit: false}
  },

  enableButton: function() {
    this.setState({canSubmit: true})
  },

  disableButton: function() {
    this.setState({canSubmit: false})
  },

  handleSubmit: function(data) {
    this.props.context.executeAction(createVolunteer, data)
  },

  render: function() {
    var message
    if (this.props.error) { // error message
      message = (
        <p>Wystąpił nieznany błąd.</p>
      )
    }

    return (
      <Formsy.Form className="registrationForm" onSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>

        <BasicForm {...this.state} />

        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1-3"></div>
          <div className="pure-u-1 pure-u-md-2-3">
            {message}
            <button type="submit" className="pure-button pure-button-primary" disabled={!this.state.canSubmit}>
              Wyślij
            </button>
          </div>
        </div>

      </Formsy.Form>
    )
  }
})

module.exports = Registration
