var React = require('react')
var Formsy = require('formsy-react')

var List = require('material-ui/lib/lists/list')
var ListItem = require('material-ui/lib/lists/list-item')
var TextField = require('material-ui/lib/text-field')
var Paper = require('material-ui/lib/paper')

var VolonteerStore = require('../stores/Volonteer')

var LeftPanel = React.createClass({
  render: function() {
    return (
      <div className="pure-u-1-4">
        <Paper zDepth={1}>
          <List>
            <ListItem primaryText="Profil" />
            <ListItem primaryText="Ustawienia" />
          </List>
        </Paper>
      </div>
    )
  }
})

var MyTextField = React.createClass({

  // Add the Formsy Mixin
  mixins: [Formsy.Mixin],

  // setValue() will set the value of the component, which in
  // turn will validate it and the rest of the form
  changeValue: function (event) {
    this.setValue(event.currentTarget.value)
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
      <TextField
        className={className}
        onChange={this.changeValue}
        value={this.getValue()}
        hintText={this.props.placeholder}
        errorText={errorMessage} />
    )
  }
})

var Settings = React.createClass({

  getInitialState: function () {
    return {
      profile: this.props.context.getStore(VolonteerStore).getState(),
      canSubmit: false
    }
  },

  _changeListener: function() {
    this.setState({
      profile: this.props.context.getStore(VolonteerStore).getState()
    })
  },

  componentDidMount: function() {
    this.props.context.getStore(VolonteerStore).addChangeListener(this._changeListener)
  },

  componentWillUnmount: function componentWillUnmount() {
    // Usuń funkcję nasłychującą
    this.props.context.getStore(VolonteerStore)
      .removeChangeListener(this._changeListener)
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
    this.props.context.executeAction(updateVolonteer, data)
  },

  render: function() {
    return (
      <div className="pure-g">
        <LeftPanel />

        <Formsy.Form className="basicSettingsForm" onSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>
        <div className="pure-u-3-4">
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
                value={this.state.profile.first_name} />
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
                value={this.state.profile.last_name} />
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
                value={this.state.profile.email} />
            </div>
          </div>

          <div className="pure-g">
            <div className="pure-u-1 pure-u-md-1-3"></div>
            <div className="pure-u-1 pure-u-md-2-3">
              <button type="submit" className="pure-button pure-button-primary" disabled={!this.state.canSubmit}>
                Zmień
              </button>
            </div>
          </div>
        </div>
        </Formsy.Form>
      </div>
    )
  }
})

module.exports = Settings
