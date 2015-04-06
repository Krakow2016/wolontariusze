var React = require('react')
var Index = React.createFactory(require('../components/Index'))
var Volonteer = React.createFactory(require('../components/Volonteer'))

var volonteers = require('../fixtures/volonteers')

module.exports = function(app) {
  app.get('/', function(req, res) {
    // React.renderToString takes your component
    // and generates the markup
    var html = React.renderToString(Index({}))
    // Wyślij html wygenerowany przez React
    res.render('index', {
        html: html
    })
  })

  app.get('/wolontariusz/:id', function(req, res) {
    var data = volonteers[req.params.id]
    var html = React.renderToString(Volonteer(data))
    // Wyślij html wygenerowany przez React
    res.render('wolontariusz', {
      html: html,
      helpers: {
        script: function(path) {
          res.locals.scripts.push(path)
          return
        }
      }
    })
  })
}
