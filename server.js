var express = require('express'),
    handlebars  = require('express-handlebars'),
    path = require('path'),
    bodyParser = require('body-parser'),
    React = require('react'),
    serialize = require('serialize-javascript'),
    navigateAction = require('fluxible-router').navigateAction,
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    session = require('express-session'),
    flash = require('connect-flash')

// Wyświetlanie komunikatów kontrolnych
var debug = require('debug')('Server')

require("node-jsx").install({extension: '.jsx'})
var HtmlComponent = React.createFactory(require('./app/components/Html.jsx'));
var server = module.exports = express()

// Obiekt udostępniający metody dostępu do danych wolontariuszy (CRUD)
var Volonteer = require('./app/services/rethinkdb/volonteers')

var app = require('./app/fluxible')
// Get access to the fetchr plugin instance
var fetchrPlugin = app.getPlugin('FetchrPlugin');
// Nakładka na serwisy danych ograniczająca dostęp do prywatnych atrybutów
var Protect = require('./lib/protect')

// Konfiguracja middleware-u Passport definująca metodę weryfikacji poprawności
// logowania.
passport.use(new LocalStrategy(
  function(username, password, done) {
    // Próba logowania
    Volonteer.read({}, 'Volonteers', { email: username }, {}, function (err, users) {
      var user = users[0]
      // Wystąpił niespodziewany błąd
      if (err) { return done(err) }
      // Nie znaleziono użytkownika o danym loginie
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' })
      }
      // Sprawdź poprawność hasła
      if (user.password !== password) { // TODO: bcrypt
        return done(null, false, { message: 'Incorrect password.' })
      }
      // Zalogowano poprawnie, zwróć obiekt zalogowanego użytkownika
      return done(null, user, { message: 'Welcome!' })
    });
  }
))

// Zdefiniuj metodę przechowywania referencji do obiektu zalogowanego
// użytkownika. Ta zmienna będę skojarzona z sesją użytkownika i przechowywana
// w pamięci serwera.
passport.serializeUser(function(user, done) {
  done(null, user.id)
})

// Zdefiniuj metodę odtworzenia obiektu użytkownika na podstawie wcześniej
// zapamiętanej referencji (numeru id w bazie danych).
passport.deserializeUser(function(id, done) {
  Volonteer.read({}, 'Volonteers', { id: id }, {is_owner: true}, function (err, user) {
    done(err, user)
  })
})

// Get information from html forms
server.use(bodyParser.json())
// Parse the URL-encoded data with qs library
server.use(bodyParser.urlencoded({ extended: true }))
// Serwuj wszystkie pliki w katalogu public/ jako zwykłe pliki statyczne.
server.use(express.static(path.join(__dirname, 'public')))

server.use(function(req, res, next){
  // Zapamiętaj w tablicy plik vendor.js do dołączenia jako skrypt na każdej
  // stronie serwowanej klientowi.
  res.locals.scripts = ['/js/vendor.js']
  next();
});

server.use(session({ secret: 'secret' }))
// Middleware służący do wyświetlania komunikatów flash
server.use(flash())
// Przepujść każde zapytanie przez middleware do autoryzacji Passport.
server.use(passport.initialize())
// Przechowywuj sesje użytkownika w pamięci serwera.
server.use(passport.session())

// Użyj silnika szablonów Handlebars
server.engine('handlebars', handlebars({
  defaultLayout: 'main',
}))
server.set('view engine', 'handlebars')

if(fetchrPlugin) {
  // Register our messages REST services
  fetchrPlugin.registerService(Protect(Volonteer));
  // Set up the fetchr middleware
  server.use(fetchrPlugin.getXhrPath(), fetchrPlugin.getMiddleware());
}

// W pierwszej kolejności sprawdź ścieżki z poza single-page
// application
server.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true
}));

server.get('/logout', function(req, res){
  req.logout()
  res.redirect('/')
})

// Zwraca stronę aplikacji
server.use(function(req, res, next) {
  // Dołącz obiekt zalogowanego użytkownika do kontekstu (stanu) zapytania,
  // który zostanie przekazay do klienta (przeglądarki).
  var context = app.createContext({
    user: req.user
  });

  debug('Executing navigate action');
  context.executeAction(navigateAction, {
    url: req.url
  }, function (err) {
    if (err) {
      debug('There was an error: '+ JSON.stringify(err));
      if (err.status && err.status === 404) {
        next();
      } else {
        next(err);
      }
      return;
    }

    debug('Exposing context state');
    var exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

    debug('Rendering Application component into html');
    var Component = app.getComponent();

    var html = React.renderToStaticMarkup(HtmlComponent({
      state: exposed,
      markup: React.renderToString(Component({
        context: context.getComponentContext()
      })),
      context: context.getComponentContext(),
      script: app.script,
      error: req.flash('error'),
      success: req.flash('success')
    }));

    debug('Sending markup');
    res.send(html);
  })
})
