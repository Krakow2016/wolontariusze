module.exports = function(service) {
  var module = require('./'+ service +'/joints')
  var timestamp = require('./helpers/timestamp')

  var create = module.create
  module.create = function(req, resource, params, body, config, callback) {
    // Zapisz identyfikator użytkownika który stworzy aktywność
    if(body.length) {
      body.forEach(function(joint) {
        joint.created_by = req.user.id
      })
    } else {
      body.created_by = req.user.id
    }
    create(req, resource, params, body, config, callback)
  }

  return timestamp(module)
}
