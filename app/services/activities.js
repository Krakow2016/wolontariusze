module.exports = function(service) {
  var service = require('./'+ service +'/activities')
  var protect = require('./helpers/protect')
  var timestamp = require('./helpers/timestamp')

  var create = service.create
  service.create = function(req, resource, params, body, config, callback) {
    // Zapisz identyfikator użytkownika który stworzy aktywność
    body.user_id = req.user.id
    create(req, resource, params, body, config, callback)
  }

  return protect(timestamp(service))
}
