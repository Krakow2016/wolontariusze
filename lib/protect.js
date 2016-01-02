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
        // zapytania.
        var user = req.user
        // Flaga przywilejów administratora
        var is_admin = (user && user.is_admin) || req.force_admin
        // Flaga właściciela profilu
        var is_owner = (user && (params.id === user.id || params.user_id === user.id))

        // Jeźeli posiadamy uprawnienia administratora lub przeglądamy własny
        // profil potrzebujemy dostępu do wszystkich parametrów modelu
        // wolontariusza.
        if(is_admin || is_owner) {
          callback(null, result)
        } else { // Ograniczamy dostęp do niektórych atrybutów

          var storeName = resource
          var store = require('../app/stores/'+ storeName)
          var attrs = store.model.attributes && store.model.attributes()

          // Sprawdź czy którykolwiek z atrybutów jest do odczytu
          if(attrs && !attrs.length) {
            return callback('403') // Brak dostępu
          }

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
    // Iteruj po bezpiecznych parametrach
    // W przypadku zapytania xhr zmienna `req` reprezentuje obiekt tego
    // zapytania.
    var user = req.user
    // Flaga przywilejów administratora
    var is_admin = user && user.is_admin
    // Obiekt definiujący przechowywanie pojedynczego zasobu
    var store = require('../app/stores/'+ resource).model

    var attributes = store.attributes()
    if(is_admin) {
      // Wykonaj oryginalną metodę `create`
      create(req, resource, params, body, config, callback)
    } else if(!attributes.length) {
      return callback('403') // Brak uprawnień
    } else {
      var protected_body = {}
      // Iteruj po bezpiecznych parametrach
      attributes.forEach(function(attribute) {
        if(body[attribute]) {
          protected_body[attribute] = body[attribute]
        }
      })
      // Wykonaj oryginalną metodę `create`
      create(req, resource, params, protected_body, config, callback)
    }
  }

  var update = service.update
  service.update = function(req, resource, params, body, config, callback) {
    var id = body.id || params.id
    // Iteruj po bezpiecznych parametrach
    // W przypadku zapytania xhr zmienna `req` reprezentuje obiekt tego
    // zapytania.
    var user = req.user
    // Flaga przywilejów administratora
    var is_admin = (user && user.is_admin) || req.force_admin
    // Flaga właściciela profilu
    var is_owner = user && (id === user.id)

    if(is_admin || is_owner) {
      // Wykonaj oryginalną metodę `create`
      update(req, resource, params, body, config, callback)
    } else {
      return callback('403') // Brak uprawnień
    }
  }
  return service
}
