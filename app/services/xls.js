module.exports = function(service) {
  var service = require('./'+ service +'/xls')
  var admin = require('./helpers/admin')

  return protect(service)
}

