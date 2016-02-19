module.exports = function(service) {
  var module = require('./'+ service +'/joints')
  var timestamp = require('./helpers/timestamp')

  return timestamp(module)
}

