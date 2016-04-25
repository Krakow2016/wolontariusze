module.exports = function(service) {
  var module = require('./'+ service +'/pilgrims')
  return module
}
