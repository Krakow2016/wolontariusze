module.exports = function(service) {
  var module = require('./'+ service +'/pilgrims')
  var restrict = require('./helpers/restrict')

  return restrict(module)
}
