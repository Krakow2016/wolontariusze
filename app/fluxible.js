'use strict'

var React = require('react'),
  Fluxible = require('fluxible'),
  fetchrPlugin = require('fluxible-plugin-fetchr'),
  RouteStore = require('fluxible-router').RouteStore

var routes = require('./routes')
var ApplicationStore = require('./stores/ApplicationStore')
var VolunteerStore = require('./stores/Volunteer')
var VolunteersStore = require('./stores/Volunteers')
var ActivityStore = require('./stores/Activity')
var ActivitiesStore = require('./stores/Activities')
var NewCommentStore = require('./stores/NewComment')
var CommentsStore = require('./stores/Comments')
var ResultsStore = require('./stores/Results')
var IntegrationsStore = require('./stores/Integrations')
var APIClientStore = require('./stores/APIClient')
var APIClientsStore = require('./stores/APIClients')
var XlsStore = require('./stores/Xls')
var IndexStore = require('./stores/Index')
var AccountActivationStore = require('./stores/AccountActivation')

var passportPlugin = require('./plugins/passportPlugin')

var moment = require('moment')
    moment.locale('pl')

// Instancja kontenera aplikacji Fluxible
var app = new Fluxible({
  component: React.createFactory(require('./components/Application.jsx')),
  stores: [
    RouteStore.withStaticRoutes(routes),
    ApplicationStore,
    VolunteerStore,
    VolunteersStore,
    NewCommentStore,
    CommentsStore,
    ActivityStore,
    ActivitiesStore,
    ResultsStore,
    IntegrationsStore,
    APIClientStore,
    APIClientsStore,
    XlsStore,
    IndexStore,
    AccountActivationStore
  ]
})

app.plug(fetchrPlugin({
  xhrPath: '/api/v1'
}))

app.plug(passportPlugin())

module.exports = app
