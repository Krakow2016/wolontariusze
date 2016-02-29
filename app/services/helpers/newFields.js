module.exports = function(service) {

  var create = service.create
  service.create = function(req, resource, params, body, config, callback) {
    body.created_at = new Date().toISOString()
    var id = '-1'
    if(req.user && req.user.id)  {
      id = req.user.id
    }
    body.creator = id
    create(req, resource, params, body, config, callback)
  }

  var update = service.update
  service.update = function(req, resource, params, body, config, callback) {
    body.updated_at = new Date().toISOString()
    var id = '-1'
    if(req.user && req.user.id)  {
      id = req.user.id
    }
    body.editor = id
    update(req, resource, params, body, config, callback)
  }

  return service
}
