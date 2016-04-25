'use strict'

var React = require('react')
var ReactDOM = require('react-dom')
var debug = require('debug')
var app = require('./fluxible.js')

var bootstrapDebug = debug('Example')
var dehydratedState = window.App // Sent from the server

// For chrome dev tool support
window.React = React
debug.enable('*')

// Przywróć zapisany stan aplikacji, który wystąpił po stronie serwera, po
// wygenerowaniu całego kodu html.
bootstrapDebug('rehydrating app')
app.rehydrate(dehydratedState, function (err, context) {
  if (err) { throw err }
  window.context = context

  // Wskarz element do którego został załadowany wyjściowy html aplikacji.
  var mountNode = document.getElementById('app')

  bootstrapDebug('React Rendering')
  var Component = app.getComponent()
  ReactDOM.render(
    Component({
      context: context.getComponentContext()
    }),
    mountNode, function () {
      bootstrapDebug('React Rendered')
    }
  )
})
