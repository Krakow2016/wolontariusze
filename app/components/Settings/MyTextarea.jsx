var React = require('react')
var Formsy = require('formsy-react')

var MyTextarea = React.createClass({

  // Add the Formsy Mixin
  mixins: [Formsy.Mixin],

  // setValue() will set the value of the component, which in
  // turn will validate it and the rest of the form
  changeValue: function (event) {
    this.setValue(event.currentTarget.value)
  },

  render: function () {
    return (
      <textarea
        onChange={this.changeValue}
        placeholder={this.props.placeholder}
        value={this.getValue()}>
      </textarea>
    )
  }
})

module.exports = MyTextarea
