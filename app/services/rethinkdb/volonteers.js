// The service code that you write is always executed on the server, but can be
// accessed transparently from actions without any knowledge of whether it's on
// the server or client. Fetchr provides an appropriate abstraction so that you
// can fetch (CRUD) the data needed in your stores using the same exact syntax
// on server and client side.
//
// Więcej: http://fluxible.io/guides/data-services.html

var r = require('rethinkdb')

var public_attrs = [
  'id',
  'first_name',
  'last_name',
  'city',
  'profile_picture',
  'background_picture',
  'interests',
  'departments',
  'my_dream'
]

var private_attrs = [
  'is_admin',
  'experience'
]

module.exports = {
    name: 'volonteers',
    // at least one of the CRUD methods is required
    read: function(req, resource, params, config, callback) {
      // W przypadku zapytania xhr zmienna `req` reprezentuje obiekt tego
      // zapytania. W przeciwnym razie obiekt zalogowanego użytkownika
      // przekazujemy w parametrze `config`.
      var user = req.user || config.user
      // Flaga przywilejów administratora
      var is_admin = user && user.is_admin
      // Flaga właściciela profilu
      var is_owner = (user && (params.id == user.id)) || config.is_owner

      r.connect({db: 'sdm'}, function(err, conn){

          if(err) { // Wystąpił błąd przy połączeniu z bazą danych
              callback(err)
              return
          }

          if(params.id) { // Pobierz krotkę o danym numerze id
              r.table(resource).get(params.id).run(conn, function(err, row){
                  console.log(err, row)
                  callback(err || !row, row)
              })
          } else { // Pobierz listę krotek
              if(params.email) { // use index
                  r.table(resource).getAll(params.email, {index: 'email'}).run(conn, function(err, cursor) {
                      cursor.toArray(callback)
                  })
              } else { // Brak identyfikatora
                  // Zwróć wszyskich wolontariuszy
                  r.table(resource).limit(50).run(conn, function(err, cursor) {
                      cursor.toArray(callback)
                  })
              }
          }
      })

      //if(volonteer) {
        //var model = {}
        //// Tablica parametrów uprawnionych do odczytu
        //var attrs = public_attrs

        //// Jeźeli posiadamy uprawnienia administratora lub
        //// przeglądamy własny profil potrzebujemy dostępu do
        //// wszystkich parametrówmodelu wolontariusza
        //if(is_admin || is_owner) {
          //attrs = attrs.concat(private_attrs)
        //}

        //// Przepisz dozwolone parametry do zwracanego obiektu
        //attrs.forEach(function(attr){
          //model[attr] = volonteer[attr]
        //})

        //callback(null, model);
      //} else {
        //callback("404")
      //}
    },

    create: function(req, resource, params, body, config, callback) {
        r.connect({db: 'sdm'}, function(err, conn) {
            if(err) {
                callback(err)
                return
            }

            r.table(resource).insert(params).run(conn, callback)
        })
    },

    // update: function(resource, params, body, config, callback) {},
    // delete: function(resource, params, config, callback) {}

};
