var React = require('react')
var Formsy = require('formsy-react')

var MyTextField = React.createClass({

  // Add the Formsy Mixin
  mixins: [Formsy.Mixin],

  // setValue() will set the value of the component, which in
  // turn will validate it and the rest of the form
  changeValue: function (event) {
    if (typeof(this.props.onChange) == 'function') {
      if(this.props.name) {
        event.currentTarget.name = this.props.name
      }
      this.props.onChange(event)
    }
    this.setValue(event.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value'])
  },

  render: function () {

    // Set a specific className based on the validation
    // state of this component. showRequired() is true
    // when the value is empty and the required prop is
    // passed to the input. showError() is true when the
    // value typed is invalid
    var className = this.showRequired() ? 'required' : this.showError() ? 'error' : null

    // An error message is returned ONLY if the component is invalid
    // or the server has returned an error message
    var errorMessage = this.getErrorMessage()

    // Set a specific className based on the validation state of this
    // component. showRequired() is true when the value is empty and the
    // required prop is passed to the input. showError() is true when the value
    // typed is invalid
    var className = this.showRequired() ? 'required' : this.showError() ? 'error' : null;

    return (
      <div className={className}>
        <input
          name={this.props.name}
          type={this.props.type}
          className={className}
          onChange={this.changeValue}
          value={this.getValue()}
          hintText={this.props.placeholder}
          disabled={this.props.disabled}
          errorText={errorMessage}
          placeholder={this.props.placeholder} />
        <span>{errorMessage}</span>
      </div>
    )
  }
})

module.exports = MyTextField
