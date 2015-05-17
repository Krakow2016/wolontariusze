var express = require('express'),
    handlebars  = require('express-handlebars'),
    path = require('path'),
    bodyParser = require('body-parser'),
    React = require('react'),
    serialize = require('serialize-javascript'),
    navigateAction = require('fluxible-router').navigateAction,
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    session = require('express-session')

// Wyświetlanie komunikatów kontrolnych
var debug = require('debug')('Server')

require("node-jsx").install({extension: '.jsx'})
var HtmlComponent = React.createFactory(require('./app/components/Html.jsx'));
var server = module.exports = express()
var Users = require('./app/pages/volonteer/services')

passport.use(new LocalStrategy(
  function(username, password, done) {
    debug("Próba logowania: "+username+", "+password)

    Users.read({}, 'volonteer', { email: username }, {}, function (err, user) {
      debug("Logowanie: "+err)
      debug("User: "+JSON.stringify(user))
      if (err) { return done(err) }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' })
      }
      if (!user.password === password) { // TODO: bcrypt
        return done(null, false, { message: 'Incorrect password.' })
      }
      return done(null, user)
    });
  }
))

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  Users.read({}, 'volonteer', { id: id }, {}, function (err, user) {
    done(err, user)
  })
})

// Get information from html forms
server.use(bodyParser.json())
// Parse the URL-encoded data with qs library
server.use(bodyParser.urlencoded({ extended: true }))

server.use(express.static(path.join(__dirname, 'public')))

server.use(function(req, res, next){
    res.locals.scripts = ['/js/vendor.js']
    next();
});

server.use(session({ secret: 'secret' }))
server.use(passport.initialize())
server.use(passport.session())

// Użyj silnika szablonów Handlebars
server.engine('handlebars', handlebars({
    defaultLayout: 'main',
}))
server.set('view engine', 'handlebars')

var fluxify = function(app, req, res, next) {
    console.log(app)
    // Get access to the fetchr plugin instance
    var fetchrPlugin = app.getPlugin('FetchrPlugin');
    if(fetchrPlugin) {
        // Register our messages REST service
        fetchrPlugin.registerService(require('./app/pages/volonteer/services'));
        // Set up the fetchr middleware
        server.use(fetchrPlugin.getXhrPath(), fetchrPlugin.getMiddleware());
    }

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
            script: app.script
        }));

        debug('Sending markup');
        res.send(html);
    })
}

// Set up Routes for the application
var volonteer = require('./app/pages/volonteer/app')
var home = require('./app/pages/home/app')
var login = require('./app/pages/login/app')

server.get('/', function(req, res, next) {
  fluxify(home, req, res, next)
})

server.get('/wolontariusz/:id', function(req, res, next) {
  fluxify(volonteer, req, res, next)
})

server.get('/login', function(req, res, next) {
  fluxify(login, req, res, next)
})

server.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));
