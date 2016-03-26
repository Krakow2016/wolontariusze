module.exports = function(service) {
  var module = require('./'+ service +'/activities')
  var restrict = require('./helpers/restrict')
  var protect = require('./helpers/protect')
  var timestamp = require('./helpers/timestamp')

  var create = module.create
  module.create = function(req, resource, params, body, config, callback) {
    // Zapisz identyfikator użytkownika który stworzy aktywność
    body.created_by = req.user.id
    create(req, resource, params, body, config, callback)
  }

  return restrict(protect(timestamp(module)))
}
