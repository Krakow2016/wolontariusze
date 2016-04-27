'use strict'

var TimeService = {

  showTime: function (timestamp) {
    var d = new Date (timestamp)
    var year = d.getFullYear()
    var month = d.getMonth()+1
    var day = d.getDate()
    var hour = (d.getHours() >= 10) ? (d.getHours()) : ('0'+d.getHours())
    var min = (d.getMinutes() >= 10) ? (d.getMinutes()) : ('0'+d.getMinutes())
    return year+'/'+month+'/'+day+' '+hour+':'+min
  },

  isDate: function (obj) {
    if (typeof obj == 'undefined' || obj == this.NO_DATE)
      return false
    
    return true
  },
    
  NO_DATE: '3000-01-01T00:00:00.000Z'
}

module.exports = TimeService
