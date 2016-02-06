module.exports = function(service) {
  var service = require('./'+ service +'/volunteers')
  var protect = require('./helpers/protect')

  // Zapisz oryginalną metodę do pamięci podręcznej
  var create = service.create
  service.create = function(req, resource, params, body, config, callback) {
    if(req.user && req.user.is_admin) {
      create(req, resource, params, body, config, callback)
    } else {
      callback(403)
    }
  }

  return protect(service)
}
