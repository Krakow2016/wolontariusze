var React = require('react'),
    Fluxible = require('fluxible'),
    fetchrPlugin = require('fluxible-plugin-fetchr'),
    RouteStore = require('fluxible-router').RouteStore

var routes = require('./routes')
var ApplicationStore = require('./stores/ApplicationStore')
var VolonteerStore = require('./stores/Volonteer')
var VolonteersStore = require('./stores/Volonteers')
var ActivityStore = require('./stores/Activity')
var NewCommentStore = require('./stores/NewComment')
var CommentsStore = require('./stores/Comments')
var ResultsStore = require('./stores/Results')
var IntegrationsStore = require('./stores/Integrations')
var APIClientStore = require('./stores/APIClient')
var APIClientsStore = require('./stores/APIClients')

var passportPlugin = require('./plugins/passportPlugin')

// Instancja kontenera aplikacji Fluxible
var app = new Fluxible({
  component: React.createFactory(require('./components/Application.jsx')),
  stores: [
    RouteStore.withStaticRoutes(routes),
    ApplicationStore,
    VolonteerStore,
    VolonteersStore,
    NewCommentStore,
    CommentsStore,
    ActivityStore,
    ResultsStore,
    IntegrationsStore,
    APIClientStore,
    APIClientsStore
  ]
})

app.plug(fetchrPlugin({
  xhrPath: '/api/v1'
}))

app.plug(passportPlugin())

module.exports = app
