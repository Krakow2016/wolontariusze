module.exports = function(service) {
  // Zapisz oryginalną metodę do pamięci podręcznej
  var read = service.read
  service.read = function(req, resource, params, config, callback) {
    if(req.user && req.user.is_admin) {
      read(req, resource, params, config, callback)
    } else {
      callback(403)
    }
  }
}

