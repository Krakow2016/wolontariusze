/**
 * Module dependencies.
 */
var oauth2orize = require('oauth2orize')
var passport = require('passport')
var login = require('connect-ensure-login')
var r = require('rethinkdb')

var utils = require('./utils')
var env = process.env.NODE_ENV || 'development'
var config = require('../config.json')[env]
var conf = config.rethinkdb

var APIClients = require('../app/services/'+config.service+'/apiclients')

var admin = {
  user: { id: '', is_admin: true }
}

// create OAuth 2.0 server
var server = oauth2orize.createServer();

// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user must authenticate and approve the authorization request.  Because this
// may involve multiple HTTP request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session.  Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

server.serializeClient(function(client, done) {
  return done(null, client.id);
});

server.deserializeClient(function(id, done) {
  APIClients.read(admin, 'APIClients', { id: id }, {}, function (err, client) {
    if (err) { return done(err) }
    return done(null, client)
  })
})

// Register supported grant types.
//
// OAuth 2.0 specifies a framework that allows users to grant client
// applications limited access to their protected resources.  It does this
// through a process of the user granting access, and the client exchanging
// the grant for an access token.

// Grant authorization codes.  The callback takes the `client` requesting
// authorization, the `redirectURI` (which is used as a verifier in the
// subsequent exchange), the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application.  The application issues a code, which is bound to these
// values, and will be exchanged for an access token.

server.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done) {
  var code_id = utils.uid(16)
  var code = {
    id: code_id,
    userId: user.id,
    clientId: client.id,
    redirectURI: redirectURI
  }

  r.connect(conf, function(error, conn){
    r.table('APICodes').insert(code).run(conn, function(err, result) {
      if (err) { return done(err) }
      done(null, code_id)
    })
  })
}))

// Grant implicit authorization.  The callback takes the `client` requesting
// authorization, the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application.  The application issues a token, which is bound to these
// values.

server.grant(oauth2orize.grant.token(function(client, user, ares, done) {
  var tokenID = utils.uid(64)
  var token = {
    id: tokenID,
    userId: user.id,
    clientId: client.id
  }

  r.connect(conf, function(err, conn){
    if(err) { return console.log(err) }
    r.table('APITokens').insert(token).run(conn, function(err, result) {
      if (err) { return done(err) }
      done(null, tokenID)
    })
  })
}))

// Exchange authorization codes for access tokens.  The callback accepts the
// `client`, which is exchanging `code` and any `redirectURI` from the
// authorization request for verification.  If these values are validated, the
// application issues an access token on behalf of the user who authorized the
// code.

server.exchange(oauth2orize.exchange.code(function(client, code, redirectURI, done) {
  r.connect(conf, function(error, conn){
    r.table('APICodes').get(code).run(conn, function(err, authCode) {
      if (err) { return done(err) }
      if (!authCode) { return done(null, false) }
      if (client.id !== authCode.clientId) { return done(null, false) }
      if (redirectURI !== authCode.redirectURI) { return done(null, false) }

      r.table('APICodes').get(code).delete().run(conn, function(err, result) {
        if(err) { return done(err) }
        var tokenID = utils.uid(64)
        var token = {
          id: tokenID,
          userId: authCode.userId,
          clientId: authCode.clientId,
        }
        r.table('APITokens').insert(token).run(conn, function(err, result) {
          if (err) { return done(err) }
          done(null, tokenID)
        })
      })
    })
  })
}))

// user authorization endpoint
//
// `authorization` middleware accepts a `validate` callback which is
// responsible for validating the client making the authorization request.  In
// doing so, is recommended that the `redirectURI` be checked against a
// registered value, although security requirements may vary accross
// implementations.  Once validated, the `done` callback must be invoked with
// a `client` instance, as well as the `redirectURI` to which the user will be
// redirected after an authorization decision is obtained.
//
// This middleware simply initializes a new authorization transaction.  It is
// the application's responsibility to authenticate the user and render a dialog
// to obtain their approval (displaying details about the client requesting
// authorization).  We accomplish that here by routing through `ensureLoggedIn()`
// first, and rendering the `dialog` view. 

exports.authorization = [
  login.ensureLoggedIn('/api/v2/login'),
  server.authorization(function(clientId, redirectURI, done) {
    APIClients.read(admin, 'APIClients', { id: clientId }, {}, function (err, client) {
      if (err) { return done(null, false, err) }

      // WARNING: For security purposes, it is highly advisable to check that
      // redirectURI provided by the client matches one registered with the
      // server.
      if (client.callback_url !== redirectURI) {
        return done('Callback url mismatch')
      }

      return done(null, client, redirectURI)
    })
  }),
  function(req, res){
    res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
  }
]

// user decision endpoint
//
// `decision` middleware processes a user's decision to allow or deny access
// requested by a client application.  Based on the grant type requested by the
// client, the above grant middleware configured above will be invoked to send
// a response.

exports.decision = [
  login.ensureLoggedIn('/api/v2/login'),
  server.decision()
]


// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

exports.token = [
  passport.authenticate(['oauth2-client-password'], { session: false }),
  server.token(),
  server.errorHandler()
]
