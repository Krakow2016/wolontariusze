'use strict'

var TimeService = {
    
    showTime: function (timestamp) {
        var d = new Date (timestamp);
        var year = d.getFullYear();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var hour = (d.getHours() >= 10) ? (d.getHours()) : ("0"+d.getHours());
        var min = (d.getMinutes() >= 10) ? (d.getMinutes()) : ("0"+d.getMinutes());
        return year+"/"+month+"/"+day+" "+hour+":"+min;
    }
}

module.exports = TimeService;
