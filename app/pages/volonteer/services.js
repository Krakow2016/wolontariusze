// The service code that you write is always executed on the server, but can be
// accessed transparently from actions without any knowledge of whether it's on
// the server or client. Fetchr provides an appropriate abstraction so that you
// can fetch (CRUD) the data needed in your stores using the same exact syntax
// on server and client side.
//
// Więcej: http://fluxible.io/guides/data-services.html

var volonteers = {
    "1": {
        id: "1",
        first_name: "Faustyna",
        last_name: "Kowalska",
        email: "faustyna@kowalska.pl",
        password: "faustyna",
        city: "Łagiewniki",
        profile_picture: "http://i.picresize.com/images/2015/05/25/2VNu8.jpg",
        background_picture: "http://www.solvaypark.pl/_img/solvaypark/galeria/tereny/1.jpg",
        interests: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean felis enim, condimentum ac suscipit venenatis, tincidunt ac est. Duis tempor elementum nunc, et luctus diam iaculis id. Fusce finibus lorem sit amet lorem pellentesque porta. Duis sagittis dolor a nisl tempus fermentum. Donec commodo augue velit, a bibendum dui dapibus vitae.',
        departments: 'Ut aliquam sagittis felis a aliquet. Quisque in tempor lacus. Nulla mattis bibendum nibh, gravida consectetur ante condimentum eget. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed eu leo consectetur, vestibulum dui sed, convallis massa. Mauris aliquam porttitor dolor id aliquam. Sed tellus diam, eleifend quis elit molestie, imperdiet dapibus leo.',
        my_dream: 'Aliquam at fermentum mi. Vestibulum varius lorem sit amet semper tempor. Nullam aliquam pulvinar commodo. Nulla volutpat cursus dolor, eget tincidunt velit pretium in. Donec dictum rutrum condimentum. Ut tincidunt ante ac odio venenatis, eu laoreet velit pharetra. Proin placerat sapien velit, vitae vulputate libero eleifend sit amet.',
        experience: 'Ut sem dolor, volutpat vitae urna quis, aliquam bibendum dolor. Sed id diam in nulla mollis porta. Nulla facilisi. Morbi gravida tortor euismod, faucibus nunc nec, porttitor lacus. Maecenas nisi velit, suscipit sed justo ac, gravida eleifend sapien.'
    },
    "2": {
        id: "2",
        is_admin: true,
        first_name: "Karol",
        last_name: "Wojtyła",
        email: "karol@wojtyla.pl",
        password: "karol",
        city: "Wadowice",
        profile_picture: "http://i.picresize.com/images/2015/05/25/Fj0AB.jpg",
        background_picture: "http://www.fakt.pl/m/crop/-658/-500/faktonline/635660778242473315.jpg",
        interests: 'piłka nożna i sporty zespołowe. Uwielbiam wycieczki po górach i jajecznicę w schronisku po całym dniu wspinaczki.',
        departments: 'organizację spotkań wolontariuszy i pomagać tworzyć atmosferę braterstwa i wspólnej sprawy jaką są Światowe Dni Młodzieży w Krakowie.',
        my_dream: 'aby wszyscy ludzie byli braćmi.',
        experience: 'Prywatne - pole nie powinno być widoczne publicznie. Tylko do wglądu administratorów i samego wolontariusza.'
    }
}

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
    name: 'volonteer',
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

      var volonteer
      if(params.id) {
        volonteer = volonteers[params.id]
      } else if(params.email) {
        id = Object.keys(volonteers).filter(function(id) {
          el = volonteers[id]
          return el.email === params.email
        })[0]

        volonteer = id ? volonteers[id] : null
      } else { // Brak identyfikatora
          // Zwróć wszyskich wolontariuszy
          var results = Object.keys(volonteers).map(function(key) {
              return volonteers[key]
          })
          callback(null, results)
          return
      }

      if(volonteer) {
        var model = {}
        // Tablica parametrów uprawnionych do odczytu
        var attrs = public_attrs

        // Jeźeli posiadamy uprawnienia administratora lub
        // przeglądamy własny profil potrzebujemy dostępu do
        // wszystkich parametrówmodelu wolontariusza
        if(is_admin || is_owner) {
          attrs = attrs.concat(private_attrs)
        }

        // Przepisz dozwolone parametry do zwracanego obiektu
        attrs.forEach(function(attr){
          model[attr] = volonteer[attr]
        })

        callback(null, model);
      } else {
        callback("404")
      }
    },

    create: function(req, resource, params, body, config, callback) {
        volonteers.push({
            id: params.id,
            threadID: params.threadID,
            threadName: params.threadName,
            authorName: params.authorName,
            text: params.text,
            timestamp: params.timestamp
        });
        callback(null, _messages);
    }

    // update: function(resource, params, body, config, callback) {},
    // delete: function(resource, params, config, callback) {}

};
