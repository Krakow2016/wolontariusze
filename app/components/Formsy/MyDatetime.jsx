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
    var errorMessage
    if (!this.isValidValue()) {
      errorMessage = 'Niepoprawny format daty'
    }
    var time = this.getValue()
    return (
      <div>
        <span className="mydatetime-validation-error">{errorMessage}</span>
        <DateTime open={false}
          dateFormat={'YYYY/M/D'}
          timeFormat={'HH:mm'}
          value={time}
          onChange={this.changeValue}/>
      </div>
    )
  }
})

module.exports = MyDatetime