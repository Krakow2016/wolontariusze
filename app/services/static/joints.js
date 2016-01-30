

var joints = require('./joints.json')

module.exports = {
  name: 'Joints',
  // at least one of the CRUD methods is required
  
  create: function(req, resource, params, body, config, callback) {
    if(!req.user) {
      return callback(403)
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
    
    // Tworzymy wiele obiektów
    if(body.length) {
      // Opcja tylko dla adminów
      if(!req.user.is_admin) { return callback(403) }
      
      var ids = []
      for (var i=0; i<body.length; i++) {
        body[i].id = id
        joints[id] = body[i]
        ids.push(id)
        id++
      }
      callback(null, {
        generated_keys: ids
      })
      
    } else {
      // Dopisz Id usera jeżeli pole jest puste
      if(!body.user_id) {
        body.user_id = req.user.id
      }
         
      body.id = id      
      joints[id] = body
      callback(null, {
        generated_keys: [id],
        changes: [ {new_val: body} ]
      })
    }
  },

  update: function(req, resource, params, body, config, callback) {
    var ids = params.ids ? params.ids : [params.id]
    var changes = []

    for (var i = 0; i < ids.length; i++) {
      var id = ids[i]
      Object.assign(joints[id], body)
      changes.push({new_val: joints[id]})
    }

    callback (null, {
      changes: changes
    })
  }
}
