module.exports = function(service) {
  var service = require('./'+ service +'/volunteers')
  var protect = require('./helpers/protect')
  var output = {
    name: service.name
  }

  // Zapisz oryginalną metodę do pamięci podręcznej
  var create = service.create
  output.create = function(req, resource, params, body, config, callback) {
    if(req.user && req.user.is_admin) {
      body.created_by = req.user.id
      create(req, resource, params, body, config, callback)
    } else {
      callback(403)
    }
  }

  var read = service.read
  output.read = function(req, resource, params, config, callback) {
    read(req, resource, params, config, function(err, result) {
      if(!result) {
        callback(404)
        return
      }

      // Informacja dla koordynatora czy wolontariusz aktywował konto
      result.has_password = !!result.password
      delete result.password

      // Informacja o tym kiedy ostatnio wysłano access_token
      var tokens = result.access_tokens
      if(tokens) {
        result.approved_at = tokens[tokens.length-1].generated_at
        delete result.access_tokens
      }
      callback(err, result)
    })
  }

  var update = service.update
  output.update = function(req, resource, params, body, config, callback) {
    if(body.is_admin) { // Nadanie praw admina
      body.promoted_by = req.user.id
    }
    update(req, resource, params, body, config, callback)
  }

  return protect(output)
}
