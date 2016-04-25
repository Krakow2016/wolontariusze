var React = require('react')
var Formsy = require('formsy-react')

var MyCheckbox = React.createClass({
  mixins: [Formsy.Mixin],
  changeValue: function (event) {
    this.setValue(!this.getValue())
  },
  render: function () {
    return (
      <input id={this.props.id} name={this.props.name} type="checkbox" checked={this.getValue()} onChange={this.changeValue}/>
    )
  }
})

module.exports = MyCheckbox
