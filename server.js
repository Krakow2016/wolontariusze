var express = require('express'),
    handlebars  = require('express-handlebars'),
    path = require('path'),
    bodyParser = require('body-parser')

require("node-jsx").install({extension: '.jsx'})

var app = module.exports = express()

// Get information from html forms
app.use(bodyParser.json())
// Parse the URL-encoded data with qs library
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))

// Użyj silnika szablonów Handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// Set up Routes for the application
require('./app/routes/all.js')(app)

// Ustaw domyślną ścieżkę
app.get('*', function(req, res) {
  res.json({
    "route": "Sorry this page does not exist!"
  })
})
