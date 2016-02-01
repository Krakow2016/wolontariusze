module.exports = function(service) {
  var service = require('./'+ service +'/volunteers')
  var protect = require('./helpers/protect')

  return protect(service)
}
