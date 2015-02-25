var React = require('react')
var App = React.createFactory(require('../components/App').App)

module.exports = function(app) {
  app.get('/', function(req, res){
    // React.renderToString takes your component
    // and generates the markup
    var html = React.renderToString(App({}))
    // Output html rendered by react
    // console.log(myAppHtml);
    res.render('index.ejs', {html: html})
  })
}
