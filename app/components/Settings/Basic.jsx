var React = require('react')
var Formsy = require('formsy-react')

var TextField = require('material-ui/lib/text-field')

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

var Basic = React.createClass({
  render: function() {
    return (
      <div>
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
              value={this.props.first_name} />
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
              value={this.props.last_name} />
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
              value={this.props.email} />
          </div>
        </div>
      </div>
    )
  }
})

module.exports = Basic
