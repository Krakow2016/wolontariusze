// The service code that you write is always executed on the server, but can be
// accessed transparently from actions without any knowledge of whether it's on
// the server or client. Fetchr provides an appropriate abstraction so that you
// can fetch (CRUD) the data needed in your stores using the same exact syntax
// on server and client side.
//
// Więcej: http://fluxible.io/guides/data-services.html

var volonteers = require('./volonteers.json')

module.exports = {
    name: 'Volonteers',
    // at least one of the CRUD methods is required
    read: function(req, resource, params, config, callback) {

      var volonteer
      if(params.id) {
        volonteer = volonteers[params.id]
      } else if(params.key) {
        id = Object.keys(volonteers).filter(function(id) {
          el = volonteers[id]
          return el.email === params.key
        })[0]

        volonteer = (id) ? [volonteers[id]] : null
      } else { // Brak identyfikatora
          // Zwróć wszyskich wolontariuszy
          var results = Object.keys(volonteers).map(function(key) {
              return volonteers[key]
          })
          callback(null, results)
          return
      }

      if(volonteer) {
        callback(null, volonteer);
      } else {
        callback("404")
      }
    },

    // create: function(req, resource, params, body, config, callback) {},
    // update: function(resource, params, body, config, callback) {},
    // delete: function(resource, params, config, callback) {}

};
