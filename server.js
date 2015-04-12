var express = require('express'),
    handlebars  = require('express-handlebars'),
    path = require('path'),
    bodyParser = require('body-parser')

var React = require('react');
var navigateAction = require('flux-router-component').navigateAction;
var serialize = require('serialize-javascript');

require("node-jsx").install({extension: '.jsx'})

var app = require('./app');
var HtmlComponent = React.createFactory(require('./app/components/Html.jsx'));

var server = module.exports = express()

// Get information from html forms
server.use(bodyParser.json())
// Parse the URL-encoded data with qs library
server.use(bodyParser.urlencoded({ extended: true }))

server.use(express.static(path.join(__dirname, 'public')))

server.use(function(req, res, next){
    res.locals.scripts = ['/js/vendor.js']
    next();
});

// Użyj silnika szablonów Handlebars
server.engine('handlebars', handlebars({
    defaultLayout: 'main',
}))
server.set('view engine', 'handlebars')

// Set up Routes for the application
//require('./app/routes/all.js')(server)

// Ustaw domyślną ścieżkę
//server.get('*', function(req, res) {
  //res.json({
    //"route": "Sorry this page does not exist!"
  //})
//})

server.use(function (req, res, next) {
    var context = app.createContext();

    //debug('Executing navigate action');
    context.executeAction(navigateAction, {
        url: req.url
    }, function (err) {
        if (err) {
            if (err.status && err.status === 404) {
                next();
            } else {
                next(err);
            }
            return;
        }

        //debug('Exposing context state');
        var exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

        //debug('Rendering Application component into html');
        var Component = app.getComponent();

        var html = React.renderToStaticMarkup(HtmlComponent({
            state: exposed,
            markup: React.renderToString(Component({
                context:context.getComponentContext()
            })),
            context: context.getComponentContext()
        }));

        //debug('Sending markup');
        res.send(html);
    });
});
