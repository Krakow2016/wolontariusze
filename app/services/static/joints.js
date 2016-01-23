

var joints = require('./joints.json')

module.exports = {
  name: 'Joints',
  // at least one of the CRUD methods is required
  
  create: function(req, resource, params, body, config, callback) {
    if(!req.user) {
      return callback(403)
    }
    
    // Tworzymy wiele obiektów
    if(body.length) {
      // Opcja tylko dla adminów
      if(!req.user.is_admin) { return callback(403) }
    } else {
      // Dopisz Id usera jeżeli pole jest puste
      if(!body.user_id) {
        body.user_id = req.user.id
      }
      
      var ids = Object.keys(joints)
      var len = ids.length
      var lastId = parseInt(ids[len-1])
      var id
      if (isNaN(lastId)) { //lista aktywności pusta
        id = 1
      } else {
        id = lastId+1 //ostatnie id + 1
      }
      
      var activity_id = body.activity_id || config.activity_id
      var obj = {}
      for (var attr in body) {obj[attr] = body[attr]}
      for (var attr in config) {obj[attr] = config[attr]}
      obj.id = id
      
      joints[id] = obj
      callback(null, {generated_keys: [id]})
    }
  },

  update: function(req, resource, params, body, config, callback) {
    var ids = body.length ? body.map(function(x){ return x.id }) : [body.id]
    //console.log("body", body);
    //console.log("Joints", joints)
    //console.log("Ids", ids)
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i]
      joints[id].is_canceled = true
    }
    callback (null, ids);
  }
}