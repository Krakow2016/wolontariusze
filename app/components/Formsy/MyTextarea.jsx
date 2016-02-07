var React = require('react')
var Formsy = require('formsy-react')

var MyTextarea = React.createClass({

  // Add the Formsy Mixin
  mixins: [Formsy.Mixin],

  // setValue() will set the value of the component, which in
  // turn will validate it and the rest of the form
  changeValue: function (event) {
    if (typeof(this.props.onChange) == 'function') {
      if (this.props.name) {
        event.currentTarget.name = this.props.name
      }
      this.props.onChange(event)
    }
    this.setValue(event.currentTarget.value)
  },

  render: function () {
    return (
      <textarea
        className="settings"
        name={this.props.name}
        onChange={this.changeValue}
        placeholder={this.props.placeholder}
        value={this.getValue()}>
      </textarea>
    )
  }
})

module.exports = MyTextarea
