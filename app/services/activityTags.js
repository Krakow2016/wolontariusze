module.exports = function(service) {
  var module = require('./'+ service +'/activityTags')
  var timestamp = require('./helpers/timestamp')

  return timestamp(module)
}

