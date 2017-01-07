module.exports = function(service) {

  var read = service.read
  service.read = function(req, resource, params, config, callback) {
    read(req, resource, params, config, function (error, data) {
        if (error) {
          callback(error,data)
        }
        var isWhatWeDoPage = (resource == 'Activities' && params.id == 'what-we-do' )
        var isPublic = (data && data.is_public)
        var isActivity = (resource == 'Activities')

        if( (isActivity && !req.user  && !isPublic ) ||
            (!isActivity && !req.user) ) { return callback({statusCode: 403}) } 
        if( isActivity && !req.user && isPublic ) {
          data.volunteers = []
        }
        callback(error,data)              
    })
  }

  var create = service.create
  service.create = function(req, resource, params, body, config, callback) {
    if(!req.user) { return callback({statusCode: 403}) }
    create(req, resource, params, body, config, callback)
  }

  var update = service.update
  service.update = function(req, resource, params, body, config, callback) {
    if(!req.user) { return callback({statusCode: 403}) }
    update(req, resource, params, body, config, callback)
  }

  var _delete = service.delete
  service.delete = function(req, resource, params, config, callback) {
    if(!req.user) { return callback({statusCode: 403}) }
    _delete(req, resource, params, config, callback)
  }

  return service
}
