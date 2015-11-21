var express = require('express'),
    handlebars  = require('express-handlebars'),
    path = require('path'),
    bodyParser = require('body-parser'),
    React = require('react'),
    serialize = require('serialize-javascript'),
    navigateAction = require('fluxible-router').navigateAction,
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    LocalAPIKeyStrategy = require('passport-localapikey-update').Strategy,
    session = require('express-session'),
    flash = require('connect-flash'),
    request = require('request'),
    crypto = require('crypto'),
    bcrypt = require('bcrypt')

// Wyświetlanie komunikatów kontrolnych
var debug = require('debug')('Server')
var config = require('./config.json')
// Połączenie z sendgrid daje nam możliwość wysyłania emaili
var sendgrid = require('sendgrid')(config.sendgrid_apikey)

require("node-jsx").install({extension: '.jsx'})
var HtmlComponent = React.createFactory(require('./app/components/Html.jsx'));
var server = module.exports = express()

// Źródło danych - obiekt udostępniający metody dostępu do danych wolontariuszy
// (CRUD). Zamień w ścieżkach pliku `static` na `rethinkdb` aby podłączyć się
// pod lokalną bazę danych.
var Activity = require('./app/services/'+config.service+'/activities')
var Comments = require('./app/services/'+config.service+'/comments')
var Volonteer = require('./app/services/'+config.service+'/volonteers')

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
    Volonteer.read({force_admin: true}, 'Volonteers', { key: username }, { index: 'email' }, function (err, users) {
      var user = users[0]
      // Wystąpił niespodziewany błąd
      if (err) { return done(err) }
      // Nie znaleziono użytkownika o danym loginie
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' })
      }
      // Sprawdź poprawność hasła
      bcrypt.compare(password, user.password, function(err, res) {
        if (!res) {
          return done(null, false, { message: 'Incorrect password.' })
        } else if (!user.approved) {
          return done(null, false, { message: 'You have been banned.' })
        } else {
          // Zalogowano poprawnie, zwróć obiekt zalogowanego użytkownika
          return done(null, user, { message: 'Welcome!' })
        }
      })
    })
  }
))

// Logowanie za pomocą jednorazowego tokena
passport.use(new LocalAPIKeyStrategy({passReqToCallback: true},
  function(req, apikey, done) {
    // Znajdź konto na które podany token został wygenerowany
    Volonteer.read({force_admin: true}, 'Volonteers', { key: apikey }, { index: 'token' }, function (err, users) {
      var user = users[0]
      if (err) { return done(err) } // Błąd bazy danych
      if (!user) {
        return done(null, false)
      } else {
        var token
        var tokens = user.access_tokens || []
        var length = tokens.length
        for (var i=0; i<length; i++) {
          value = tokens[i]
          if (value.token === apikey) {
            token = value
          }
        }

        if(!token) { return done(500) } // Brak tokena - nie powinno się zdarzyć
        var expiration_date = token.generated_at + 48*60*60*1000 // +48h

        if(token.used) { // Sprawdź czy token nie został już użyty
          return done('Token already used. You must generate a new one.')
        } else if(new Date() > expiration_date) { // Sprawdź czy token nie wygasł
          return done({message: 'Token expired. You must generate a new one.'})
        } else { // Autoryzacja przebiegła pomyślnie
          token.used = { datetime: new Date(), ip: req.ip, headers: req.headers }
          Volonteer.update({force_admin: true}, 'Volonteers', {id: user.id}, {
            access_tokens: tokens
          }, {}, function (err) {
            if(err) {
              return done(err)
            }
            return done(null, user)
          })
        }
      }
    })
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
  Volonteer.read({force_admin: true}, 'Volonteers', { id: id }, {}, function (err, user) {
    done(err, user)
  })
})

// Get information from html forms
var jsonParser = bodyParser.json()
// Parse the URL-encoded data with qs library
var urlencodedParser = bodyParser.urlencoded({ extended: false })
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
  fetchrPlugin.registerService(Protect(Activity));
  fetchrPlugin.registerService(Protect(Comments));
  // Set up the fetchr middleware
  server.use(fetchrPlugin.getXhrPath(), jsonParser, fetchrPlugin.getMiddleware());
}

// W pierwszej kolejności sprawdź ścieżki z poza single-page
// application
server.post('/login', jsonParser, urlencodedParser, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  successFlash: true
}))

server.get('/logout', function(req, res){
  req.logout()
  req.flash('success', 'Wylogowano.')
  res.redirect('/')
})

server.post('/search', function(req, res) {
  if(req.user && req.user.is_admin) {
    var elasticSearch = config.elasticSearch
    req.pipe(request(elasticSearch))
      .on('error', function(e){
        res.send(500) // Brak połączenia z bazą
      }).pipe(res)
  } else {
    res.send(403)
  }
})

server.get('/invitation', passport.authenticate('localapikey', {
  successRedirect: '/witaj',
  failureRedirect: '/login',
  failureFlash: true,
  successFlash: true
}))

server.post('/invitation', jsonParser, function(req, res) {
  var id = req.body.id
  if(req.user && req.user.is_admin) {
     Volonteer.read(req, 'Volonteers', {id: id}, {}, function (err, user) {

       // Generuje losowy token dostępu
       crypto.randomBytes(32, function(ex, buf) {
         var tokens = [] //user.access_tokens || []
         // Token przekształcony do formatu szesnastkowego
         var token = buf.toString('hex')
         tokens.push({
           token: token,
           // Data potrzebna do późniejszego sprawdzenia ważności tokenu
           generated_at: new Date(),
           // Data użycia (token jest jednorazowy)
           //used_at: null,
           // IP komputera z którego nastąpiło zalogowanie
           //used_by: null
         })

         // Zapisz w token w bazie
         Volonteer.update(req, 'Volonteers', {id: id}, {
             approved: true,
             access_tokens: tokens
         }, {}, function (err) {
           if(err) {
             res.send(err)
           } else {
             var url = '/invitation?apikey='+ token
             var email = new sendgrid.Email({
               to:       user.email,
               from:     'wolontariat@krakow2016.com',
               subject:  'Zaproszenie do Góry Dobra!',
               text:     'Wolontariuszu! Chcemy zaprosić Cię do Góry Dobra - portalu dla wolontariuszy, który będzie równocześnie naszą platformą komunikacji. To tutaj chcemy stworzyć środowisko młodych i zaangażowanych ludzi, dzielić się tym, co robimy i przekazywać Wam ważne informacje o ŚDM i zadaniach, jakie czekają na realizację. Zrób coś dla siebie! Zostań Wolontariuszem ŚDM Kraków 2016. Aby się zarejestrować kliknij: http://'+ config.domain + url
             })
             sendgrid.send(email, function(err, json) {
               console.log('sendgrid:', err, url, json)
               res.send(err || json)
             })
           }
         })
       })
     })
  } else {
    res.send(403)
  }
})

// Zwraca stronę aplikacji
server.use(function(req, res, next) {
  // material-ui wymaga tej zmiennej globalnej
  GLOBAL.navigator = {userAgent: req.headers['user-agent']}
  // Dołącz obiekt zalogowanego użytkownika do kontekstu (stanu) zapytania,
  // który zostanie przekazay do klienta (przeglądarki).
  var context = app.createContext({
    user: req.user
  });

  // Przekaż do aplikacji wiadomości flash (pochodzące z serwera)
  var success = req.flash('success')[0]
  var failure = req.flash('error')[0]
  if(success) { // Sukces
    context.getActionContext().dispatch('SAVE_FLASH_SUCCESS', success)
  } else if(failure) { // Błąd
    context.getActionContext().dispatch('SAVE_FLASH_FAILURE', failure)
  }

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
        context: context.getComponentContext(),
      })),
      context: context.getComponentContext(),
      script: app.script,
    }));

    debug('Sending markup');
    res.send(html);
  })
})
