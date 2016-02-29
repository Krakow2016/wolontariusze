module.exports = function(service) {
  var service = require('./'+ service +'/activities')
  var restrict = require('./helpers/restrict')
  var protect = require('./helpers/protect')
  var newFields = require('./helpers/newFields')

  var create = service.create
  service.create = function(req, resource, params, body, config, callback) {
    // Zapisz identyfikator użytkownika który stworzy aktywność
    body.user_id = req.user.id
    create(req, resource, params, body, config, callback)
  }

  return restrict(protect(newFields(service)))
}
