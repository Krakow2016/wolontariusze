module.exports = function(service) {

  var create = service.create
  service.create = function(req, resource, params, body, config, callback) {
    body.created_at = new Date()
    create(req, resource, params, body, config, callback)
  }

  var update = service.update
  service.update = function(req, resource, params, body, config, callback) {
    delete body.created_at
    body.updated_at = new Date()
    update(req, resource, params, body, config, callback)
  }

  return service
}
