'use strict'

var express = require('express'),
  handlebars  = require('express-handlebars'),
  path = require('path'),
  bodyParser = require('body-parser'),
  React = require('react'),
  ReactDOMServer = require('react-dom/server'),
  serialize = require('serialize-javascript'),
  navigateAction = require('fluxible-router').navigateAction,
  passport = require('passport'),
  LocalAPIKeyStrategy = require('passport-localapikey-update').Strategy,
  session = require('express-session'),
  flash = require('connect-flash'),
  request = require('request'),
  crypto = require('crypto'),
  multipart = require('connect-multiparty'),
  excelParser = require('excel-parser'),
  r = require('rethinkdb'),
  AWS = require('aws-sdk'),
  async = require('async'),
  sharp = require('sharp')

// Służy do zapisywania sesji użytkowników w bazie danych
var RDBStore = require('session-rethinkdb')(session)

// Wyświetlanie komunikatów kontrolnych
var debug = require('debug')('Server')
var env = process.env.NODE_ENV || 'development'
var config = require('./config.json')[env]
// Połączenie z sendgrid daje nam możliwość wysyłania emaili
var sendgrid = require('sendgrid')(process.env.SENDGRID_APIKEY)

require('node-jsx').install({extension: '.jsx'})
var HtmlComponent = React.createFactory(require('./app/components/Html.jsx'))
var server = module.exports = express()

// Źródło danych - obiekt udostępniający metody dostępu do danych wolontariuszy
// (CRUD). Zamień w ścieżkach pliku `static` na `rethinkdb` aby podłączyć się
// pod lokalną bazę danych.
var Activities = require('./app/services/activities')(config.service)
var Comments = require('./app/services/'+config.service+'/comments')
var Volunteers = require('./app/services/volunteers')(config.service)
var Integration = require('./app/services/'+config.service+'/integrations')
var APIClient = require('./app/services/'+config.service+'/apiclients')
var Joints = require('./app/services/'+config.service+'/joints')
var Xls = require('./app/services/'+config.service+'/xls')

var app = require('./app/fluxible')
// Get access to the fetchr plugin instance
var fetchrPlugin = app.getPlugin('FetchrPlugin')

// Konfiguracja zapisu danych sesji w bazie danych
var session_store = {
  servers: [ config.rethinkdb ]
}

// Konfiguracja middleware-u Passport definująca metodę weryfikacji poprawności
// logowania.
require('./auth')

// Logowanie za pomocą jednorazowego tokena
passport.use(new LocalAPIKeyStrategy({passReqToCallback: true},
  function(req, apikey, done) {
    // Znajdź konto na które podany token został wygenerowany
    Volunteers.read({force_admin: true}, 'Volunteers', { key: apikey }, { index: 'token' }, function (err, users) {
      var user = users[0]
      if (err) { return done(err) } // Błąd bazy danych
      if (!user) {
        return done(null, false)
      } else {
        var token
        var tokens = user.access_tokens || []
        var length = tokens.length
        for (var i=0; i<length; i++) {
          var value = tokens[i]
          if (value.token === apikey) {
            token = value
          }
        }

        if(!token) { return done(500) } // Brak tokena - nie powinno się zdarzyć
        var expiration_date = token.generated_at + 48*60*60*1000 // +48h

        if(token.used) { // Sprawdź czy token nie został już użyty
          return done(null, false, {message: 'Token already used. You must generate a new one.'})
        } else if(new Date() > expiration_date) { // Sprawdź czy token nie wygasł
          return done(null, false, {message: 'Token expired. You must generate a new one.'})
        } else { // Autoryzacja przebiegła pomyślnie
          token.used = { datetime: new Date(), ip: req.ip, headers: req.headers }
          Volunteers.update({force_admin: true}, 'Volunteers', {id: user.id}, {
            access_tokens: tokens
          }, {}, function (err) {
            if(err) {
              return done(500) // Błąd bazy danych
            }
            return done(null, user)
          })
        }
      }
    })
  }
))

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
  next()
})

server.use(session({
  secret: 'secret',
  store: config.service === 'rethinkdb' ? new RDBStore(session_store) : new session.MemoryStore()
}))
// Middleware służący do wyświetlania komunikatów flash
server.use(flash())
// Przepujść każde zapytanie przez middleware do autoryzacji Passport.
server.use(passport.initialize())
// Przechowywuj sesje użytkownika w pamięci serwera.
server.use(passport.session())

// Użyj silnika szablonów Handlebars
server.engine('handlebars', handlebars({
  defaultLayout: 'main'
}))
server.set('view engine', 'handlebars')

if(fetchrPlugin) {
  // Register our messages REST services
  fetchrPlugin.registerService(Volunteers)
  fetchrPlugin.registerService(Activities)
  fetchrPlugin.registerService(Comments)
  fetchrPlugin.registerService(Integration)
  fetchrPlugin.registerService(APIClient)
  fetchrPlugin.registerService(Joints)
  fetchrPlugin.registerService(Xls)
  // Set up the fetchr middleware
  server.use(fetchrPlugin.getXhrPath(), jsonParser, fetchrPlugin.getMiddleware())
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
    var elasticSearch = config.elasticSearch +'/_search'
    req.pipe(request(elasticSearch))
      .on('error', function(e){
        res.send(500) // Brak połączenia z bazą
      }).pipe(res)
  } else {
    res.send(403)
  }
})

server.post('/suggest', function(req, res) {
  if(req.user) {
    var elasticSearch = config.elasticSearch +'/_suggest'
    req.pipe(request(elasticSearch))
      .on('error', function(e) {
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
    Volunteers.read(req, 'Volunteers', {id: id}, {}, function (err, user) {
      // Generuje losowy token dostępu
      crypto.randomBytes(32, function(ex, buf) {
        var tokens = [] //user.access_tokens || []
        // Token przekształcony do formatu szesnastkowego
        var token = buf.toString('hex')
        tokens.push({
          token: token,
          // Data potrzebna do późniejszego sprawdzenia ważności tokenu
          generated_at: new Date()
          // Data użycia (token jest jednorazowy)
          //used_at: null,
          // IP komputera z którego nastąpiło zalogowanie
          //used_by: null
        })

        // Zapisz w token w bazie
        Volunteers.update(req, 'Volunteers', {id: id}, {
          approved: true,
          access_tokens: tokens
        }, {}, function (err) {
          if(err) {
            res.send(err)
          } else {
            var url = '/invitation?apikey='+ token

            var text = 'Wolontariuszu!\n\nChcemy zaprosić Cię do Góry Dobra - portalu dla wolontariuszy, który będzie równocześnie naszą główną platformą komunikacji podczas Światowych Dni Młodzieży w Krakowie oraz narzędziem do organizacji projektów i wydarzeń.\n\nTo tutaj chcemy stworzyć środowisko młodych i zaangażowanych ludzi, dzielić się tym, co robimy i przekazywać Ci ważne informacje o ŚDM i zadaniach, jakie czekają na realizację.\n\nDzięki Górze Dobra będziesz mógł pochwalić się efektami swojej pracy. W tym też miejscu będziesz miał możliwość zobaczenia i dzielenia się z innymi informacjami o tym, jak dużo serca, i aktywności wolontariackiej dajesz na rzecz Światowych Dni Młodzieży w Krakowie.\n\nAby aktywować swoje konto kliknij w poniższy link:\n\nhttps://wolontariusze.krakow2016.com'+ url +'\n\nWAŻNE! Link, jaki otrzymujesz teraz do zalogowania, jest aktywny tylko przez 48h. W wypadku jakichkolwiek problemów bądź pytań, prosimy o kontakt na: goradobra2016@gmail.com.\n\nNie zwlekaj ani chwili dłużej i zostań już dziś Wolontariuszem ŚDM Kraków 2016.'

            var email = new sendgrid.Email({
              to:       user.email,
              from:     'wolontariat@krakow2016.com',
              subject:  'Zaproszenie do Góry Dobra!',
              text:     text
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

server.get('/stats', function(req, res) {
  if(req.user && req.user.is_admin) {
    var stats = {}

    r.connect(config.rethinkdb, function(err, conn) {
      // Błąd połączenia z bazą danych
      if(err) { return res.send(500) }

      async.parallel([function(cb){
        r.table('Volunteers').count().run(conn, function(err, result) {
          // Liczba wszystkich kont w systemie
          stats.total_accounts = result
          cb(err)
        })
      }, function(cb) {
        r.table('Imports').count().run(conn, function(err, result) {
          // Liczba wolontariuszy importowanych z bazy watykańskiej
          stats.total_volunteers = result
          cb(err)
        })
      }, function(cb) {
        r.table('Volunteers').count(function(volunteer) {
          return volunteer.hasFields('password')
        }).run(conn, function(err, result) {
          // Liczba użytkowników który mogą się zalogować do systemu
          stats.total_active = result
          cb(err)
        })
      }, function(cb) {
        r.table('Volunteers')('is_admin').count(true).run(conn, function(err, result) {
          // Liczba administratorów
          stats.total_admins = result
          cb(err)
        })
      }], function(err) {
        if(err) { res.send(500) }
        else { res.send(stats) }
      })
    })
  } else {
    res.send(403)
  }
})

var multipartMiddleware = multipart()
server.post('/import', multipartMiddleware, function(req, res) {
  if(req.user && req.user.is_admin) {
    // Parsuje plik xml do formatu json
    excelParser.parse({
      inFile: req.files.image.path, // TODO: co jeżeli > 1?
      worksheet: 'Volontari'
    }, function(err, records){
      if(err) {
        res.status(500).send(err)
        console.error(err)
        return
      }

      // Dokumenty do zapisu w bazie ElasticSearch
      var docs = []
      // Dokumenty do zapisu w bazie RethinkDB
      var volunteers = {}
      // Tablica emaili niezbędna do wykluczenia powtarzających się adresów
      // email
      var emails = []
      // Pierwszy wiersz jest tablicą atrybutów
      var keys = records.shift()

      records.forEach(function(record){
        var map = {}
        // Na potrzeby wyszukiwarki indeksujemy w ElasticSearch wszystkie
        // informacje które posiadamy.
        keys.forEach(function(key, i) {
          map[key.toLowerCase()] = record[i]
        })
        docs.push(map)
        emails.push(map['rg_email'])
        // W bazie zapisujemy tylko ustalone wcześniej podstawowe informacje
        volunteers[map['rg_email']] = {
          email: map['rg_email'],
          first_name: map['rg_firstname'],
          last_name: map['rg_lastname'],
          nationality: map['rg_nationality']
        } // TODO: języki!
      })

      r.connect(config.rethinkdb, function(err, conn) {
        // Dane do ElasticSearcha najpierw lądują w tabeli `Imports` żeby
        // później zostać automatycznie przeniesione i zcalone z odpowiadającym
        // im dokumentem wolontariusza poprzez narzędzie LogStash.
        r.table('Imports').insert(docs).run(conn, function(err, imports) {
          if(err) { return res.status(500).send(err) }

          var table = r.table('Volunteers')
          emails.push({index: 'email'})
          // Pobierz wszystkie duplikaty
          table.getAll.apply(table, emails).run(conn, function(err, cursor) {
            if(err) {
              return res.send(500)
            } else {
              cursor.toArray(function(err, result) {
                var docs = []
                // Usuń duplikaty
                result.forEach(function(volunteer) {
                  delete volunteers[volunteer.email]
                })
                // Przekonwertuj obiekt na tablicę
                Object.keys(volunteers).forEach(function(key) {
                  docs.push(volunteers[key])
                })
                // Zapisz nieistniejących wolontariuszy w bazie danych
                r.table('Volunteers').insert(docs).run(conn, function(err, result) {
                  if(err) {
                    res.status(500).send(err)
                  } else {
                    res.send(result)
                  }
                  conn.close()
                })
              })
            }
          })
        })
      })
    })
  }
})

AWS.config.update({region: 'eu-central-1'})
server.post('/upload', multipartMiddleware, function(req, res) {
  if(req.user) {
    async.parallel([
      function(cb){
        // Zdjęcie profilowe @x2 - przytnij i wyślij do S3
        sharp(req.files.avatar.path)
          .resize(750, 750)
          .quality(90)
          .toBuffer(function(err, buffer) {
            if(err) { return cb(err) }
            var s3obj = new AWS.S3({
              params: {
                Bucket: 'krakow2016',
                Key: req.user.id +'/avatar@x2' }
            })
            // pipe to s3
            s3obj.upload({Body: buffer})
              .send(cb)
        })
    }, function(cb){
        // Zdjęcie profilowe - przytnij i wyślij do S3
        sharp(req.files.avatar.path)
          .resize(375, 375)
          .quality(90)
          .toBuffer(function(err, buffer) {
            if(err) { return cb(err) }
            var s3obj = new AWS.S3({
              params: {
                Bucket: 'krakow2016',
                Key: req.user.id +'/avatar' }
            })
            // pipe to s3
            s3obj.upload({Body: buffer})
              .send(cb)
        })
    }, function(cb) {
        // Miniaturka - przytnij i wyślij do S3
        sharp(req.files.avatar.path)
          .resize(100, 100)
          .quality(75)
          .toBuffer(function(err, buffer) {
            if(err) { return cb(err) }
            var s3obj = new AWS.S3({
              params: {
                Bucket: 'krakow2016',
                Key: req.user.id +'/thumb' }
            })
            s3obj.upload({Body: buffer})
              .send(cb)
        })
    }], function(err, data) {
      if(err) {
        res.status(500).send(err)
      } else {
        var changes = {
          profile_picture_url: data[1].Location +'?'+ data[0].ETag.replace('\"', ''),
          thumb_picture_url: data[2].Location +'?'+ data[1].ETag.replace('\"', '')
        }
        Volunteers.update({force_admin: true}, 'Volunteers', {id: req.user.id}, changes, {returnChanges: true}, function(err, result) {
          res.status(201).send(result.changes[0].new_val)
        })
      }
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
    req: req,
    user: req.user
  })

  // Przekaż do aplikacji wiadomości flash (pochodzące z serwera)
  var success = req.flash('success')[0]
  var failure = req.flash('error')[0]
  if(success) { // Sukces
    context.getActionContext().dispatch('SAVE_FLASH_SUCCESS', success)
  } else if(failure) { // Błąd
    context.getActionContext().dispatch('SAVE_FLASH_FAILURE', failure)
  }

  debug('Executing navigate action')
  context.executeAction(navigateAction, {
    url: req.url
  }, function (err) {
    if (err) {
      debug('There was an error: '+ JSON.stringify(err))
      if (err.status && err.status === 404) {
        next()
      } else {
        next(err)
      }
      return
    }

    debug('Exposing context state')
    var exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';'

    debug('Rendering Application component into html')
    var Component = app.getComponent()

    var html = ReactDOMServer.renderToStaticMarkup(HtmlComponent({
      state: exposed,
      markup: ReactDOMServer.renderToString(Component({
        context: context.getComponentContext()
      })),
      context: context.getComponentContext(),
      script: app.script
    }))

    debug('Sending markup')
    res.send(html)
  })
})
