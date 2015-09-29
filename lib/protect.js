'use strict'

var util = require('util')

// Przepisuje dozwolone parametry do zwracanego obiektu
var protect = function(result, attrs) {
  // Jeżeli nie ma zdefiniowanej białej listy atrybutów, zwróć oryginalny
  // obiekt.
  if(!attrs) {
    return result
  }

  var protected_result = {}
  attrs.forEach(function(attr) {
    protected_result[attr] = result[attr]
  })
  return protected_result
}

module.exports = function(service) {
  // Zapisz oryginalną metodę do pamięci podręcznej
  var read = service.read
  service.read = function(req, resource, params, config, callback) {
    read(req, resource, params, config, function(err, result) {
      if(err) {
        callback(err)
      } else {
        // W przypadku zapytania xhr zmienna `req` reprezentuje obiekt tego
        // zapytania. W przeciwnym razie obiekt zalogowanego użytkownika
        // przekazujemy w parametrze `config`.
        var user = req.user || config.user
        // Flaga przywilejów administratora
        var is_admin = user && user.is_admin
        // Flaga właściciela profilu
        var is_owner = (user && (params.id == user.id)) || config.is_owner

        // Jeźeli posiadamy uprawnienia administratora lub przeglądamy własny
        // profil potrzebujemy dostępu do wszystkich parametrów modelu
        // wolontariusza.
        if(is_admin || is_owner) {
          callback(null, result)
        } else { // Ograniczamy dostęp do niektórych atrybutów

          var storeName = config.store || resource
          var store = require('../app/stores/'+ storeName)
          var attrs = store.attributes && store.attributes()

          var protected_result = util.isArray(result)
              ? result.map(function(x){ return protect(x, attrs) })
              : protect(result, attrs)

          callback(null, protected_result)
        }
      }
    })
  }

  // Zapisz oryginalną metodę do pamięci podręcznej
  var create = service.create
  service.create = function(req, resource, params, body, config, callback) {
    // Obiekt definiujący przechowywanie pojedynczego zasobu
    var store = require('../app/stores/'+ resource).model
    var protected_params = {}

    // Iteruj po bezpiecznych parametrach
    store.attributes().forEach(function(attribute) {
      if(params[attribute]) {
        protected_params[attribute] = params[attribute]
      }
    })
    // Wykonaj oryginalną metodę `create`
    create(req, resource, protected_params, body, config, callback)
  }
  return service
}
