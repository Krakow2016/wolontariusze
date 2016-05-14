var React = require('react')
var Formsy = require('formsy-react')
var MyTextField = require('./Formsy/MyTextField.jsx')

var AccountActivationStore = require('../stores/AccountActivation')
var actions = require('../actions')
var saveAction = actions.activateAccount

var App = React.createClass({

  propTypes: {
    context: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      email: '',
      message: '',
      canSubmit: false,
      hasLoaded: false
    }
  },

  _changeListener: function() {
    var state = this.props.context.getStore(AccountActivationStore).data
    this.setState(state)
  },

  componentDidMount: function() {
    this.props.context.getStore(AccountActivationStore)
      .addChangeListener(this._changeListener)

    this.setState({
      hasLoaded: true
    })
  },

  componentWillUnmount: function() {
    this.props.context.getStore(AccountActivationStore)
      .removeChangeListener(this._changeListener)
  },

  handleChange: function (evt) {
    var target = evt.target != null
      ? evt.target
      : evt.currentTarget
    this.setState({
      email: target.value,
      message: ''
    })
  },

  onValidSubmit: function () {
    this.props.context.executeAction(saveAction, this.state)
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

  render: function () {
    var sendButton = <input type="submit" value="Wyślij" disabled={!this.state.canSubmit} />
    return (

    <div className="login-container">
      <div>
        <h2>Formularz aktywujący konto</h2>
        <Formsy.Form
          ref="formsy"
          className="settingsForm"
          onValidSubmit={this.onValidSubmit}
          onValid={this.enableButton}
          onInvalid={this.disableButton} >

          <MyTextField required
            id='email'
            name='email'
            placeholder='Wpisz swój adres e-mail'
            validations='isEmail'
            validationError='Zły format e-mail'
            disabled={!this.state.hasLoaded}
            value={this.state.email}
            onChange={this.handleChange} />

            {sendButton}
        </Formsy.Form>
      </div>
      <br />
      {this.state.message}
     </div>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = App
