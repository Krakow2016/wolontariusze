var React = require('react')
var Formsy = require('formsy-react')
var moment = require('moment')
var DateTime = require('react-datetime')

var MyDatetime = React.createClass({
  mixins: [Formsy.Mixin],

  changeValue(m) {
      this.setValue(m)
      var time = new Date(m)
      this.props.handleChange(time)
  },

  validate() {
    var value = this.getValue()
    return !(typeof value  == 'string' && !moment(value, 'YYYY/M/D HH:mm', true).isValid())
  },

  render() {
    var className = this.showError() ? 'error' : null
    var errorMessage = this.getErrorMessage()
    var time = this.getValue()
    return (
      <div className={className}>
        <DateTime
          open={false}
          dateFormat={'YYYY/M/D'}
          timeFormat={'HH:mm'}
          value={time}
          onChange={this.changeValue}/>
        <span>{errorMessage}</span>
      </div>
    )
  }
})

module.exports = MyDatetime
