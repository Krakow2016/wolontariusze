module.exports = function(service) {
  var service = require('./'+ service +'/volunteers')
  var protect = require('./helpers/protect')

  // Zapisz oryginalną metodę do pamięci podręcznej
  var create = service.create
  service.create = function(req, resource, params, body, config, callback) {
    if(req.user && req.user.is_admin) {
      body.created_by = req.user.id
      create(req, resource, params, body, config, callback)
    } else {
      callback(403)
    }
  }

  var update = service.update
  service.update = function(req, resource, params, body, config, callback) {
    if(body.is_admin) { // Nadanie praw admina
      body.promoted_by = req.user.id
    }
    update(req, resource, params, body, config, callback)
  }

  return protect(service)
}
