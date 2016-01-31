module.exports = function(service) {
  var service = require('./'+ service +'/activities')
  var protect = require('./helpers/protect')
  var timestamp = require('./helpers/timestamp')

  return protect(timestamp(service))
}
