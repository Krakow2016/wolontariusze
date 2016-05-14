'use strict'

var pilgrims = require('./pilgrims.json')

module.exports = {
  name: 'Pilgrims',
  // at least one of the CRUD methods is required
  read: function(req, resource, params, config, callback) {
    var results = Object.keys(pilgrims).map(function(key) {
      return pilgrims[key]
    })
    callback(null, results)
    return
  }
}
