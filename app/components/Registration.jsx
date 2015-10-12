var React = require('react')
var Formsy = require('formsy-react')
var material = require('material-ui'),
    ThemeManager = new material.Styles.ThemeManager()

var VolonteerStore = require('../stores/Volonteer')
var createVolonteer = require('../actions').createVolonteer

var MyTextField = React.createClass({

  // Add the Formsy Mixin
  mixins: [Formsy.Mixin],

  // setValue() will set the value of the component, which in
  // turn will validate it and the rest of the form
  changeValue: function (event) {
    this.setValue(event.currentTarget.value)
  },

  childContextTypes: {
      muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },

  render: function () {

    // Set a specific className based on the validation
    // state of this component. showRequired() is true
    // when the value is empty and the required prop is
    // passed to the input. showError() is true when the
    // value typed is invalid
    var className = this.showRequired() ? 'required' : this.showError() ? 'error' : null;

    // An error message is returned ONLY if the component is invalid
    // or the server has returned an error message
    var errorMessage = this.getErrorMessage();

    return (
      <material.TextField
        className={className}
        onChange={this.changeValue}
        value={this.getValue()}
        hintText={this.props.placeholder}
        errorText={errorMessage} />
    )
  }
})

var MyInput = React.createClass({

  // Add the Formsy Mixin
  mixins: [Formsy.Mixin],

  // setValue() will set the value of the component, which in
  // turn will validate it and the rest of the form
  changeValue: function (event) {
    this.setValue(event.currentTarget.value)
  },

  render: function () {

    // An error message is returned ONLY if the component is invalid
    // or the server has returned an error message
    var errorMessage = this.getErrorMessage()

    return (
      <input
        id={this.props.id}
        type={this.props.type}
        onChange={this.changeValue}
        errorText={errorMessage} />
    )
  }
})

var Registration = React.createClass({

  getInitialState: function () {
    return {}
  },

  componentDidMount: function componentDidMount() {
    // Nasłuchuj zmiań na zasobie wolontariusza. Nastąpi ona po zapisaniu
    // go w bazie danych.
    this.props.context.getStore(VolonteerStore).addChangeListener(this._onStoreChange)
  },

  componentWillUnmount: function componentWillUnmount() {
    // Usuń funkcję nasłychującą.
    this.props.context.getStore(VolonteerStore).removeChangeListener(this._onStoreChange)
  },

  _onStoreChange: function() {
    // Nastąpiła zmiana w stanie zasobu wolontariusza - uaktualij widok.
    var volonteer = this.props.context.getStore(VolonteerStore).getState()
    this.setState(volonteer)
  },

  render: function() {
    if(this.state.success) {
      return (
        <p>Dziękujemy za zgłoszenie!</p>
      )
    } else {
      return (
        <RegistrationForm context={this.props.context} error={this.state.error} />
      )
    }
  }
})

var RegistrationForm = React.createClass({

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
    this.props.context.executeAction(createVolonteer, data)
  },

  render: function () {
    var message
    if(this.props.error) { // error message
      message = (<p>Wystąpił nieznany błąd.</p>)
    }

    return (
      <Formsy.Form className="registrationForm" onSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>
        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1-3">
            <label htmlFor="first_name">Imię</label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField required
              id="first_name"
              name="first_name"
              placeholder="Faustyna"
              validations="minLength:3"
              validationError="Imię jest wymagane"
              value={this.state.first_name} />
          </div>
        </div>

        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1-3">
            <label htmlFor="last_name">Nazwisko</label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField required
              id="last_name"
              name="last_name"
              placeholder="Kowalska"
              validations="minLength:3"
              validationError="Nazwisko jest wymagane"
              value={this.state.last_name} />
          </div>
        </div>

        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1-3">
            <label htmlFor="email">Adres e-mail</label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField required
              id="email"
              type="email"
              name="email"
              validations="isEmail"
              validationError="Adres email jest niepoprawny"
              placeholder="faustyna@kowalska.pl"
              value={this.state.email} />
          </div>
        </div>

        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1-3"></div>
          <div className="pure-u-1 pure-u-md-2-3">
            <p>
              <label htmlFor="cb" className="pure-checkbox">
                <MyInput required id="cb" name="agreement" type="checkbox" />
                Zgadzam się na przetwarzanie danych osobowych
              </label>
            </p>
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
