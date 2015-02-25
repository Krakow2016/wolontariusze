var express = require('express'),
    path = require('path')

require("node-jsx").install({extension: '.jsx'})

var app = express()

var bodyParser = require('body-parser')

// get information from html forms
app.use(bodyParser.json())
// parse the URL-encoded data with qs library
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Set up Routes for the application
require('./app/routes/all.js')(app)

//Route not found -- Set 404
app.get('*', function(req, res) {
  res.json({
    "route": "Sorry this page does not exist!"
  })
})

app.listen(7000)

console.log('Server is Up and Running')
