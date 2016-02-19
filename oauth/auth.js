/**
 * Module dependencies.
 */
var passport = require('passport')
var BasicStrategy = require('passport-http').BasicStrategy
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy
var BearerStrategy = require('passport-http-bearer').Strategy
var r = require('rethinkdb')

var env = process.env.NODE_ENV || 'development'
var config = require('../config.json')[env]

var APIClients = require('../app/services/'+config.service+'/apiclients')
var APITokens = require('../app/services/'+config.service+'/apitokens')
var Volunteers = require('../app/services/volunteers')(config.service)

/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients.  They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens.  The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate.  Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header).  While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
//passport.use(new BasicStrategy(
  //function(clientID, clientSecret, done) {
    //r.connect(conf, function(error, conn){
      //r.table('APIClient').get(clientID).run(conn, function(err, user){
        //if (err) { return done(err) }
        //if (!client) { return done(null, false) }
        //if (client.clientSecret != password) { return done(null, false) }
        //return done(null, client)
      //})
    //})
  //}
//));

passport.use(new ClientPasswordStrategy(function(clientId, clientSecret, done) {
  APIClients.read({force_admin: true}, 'APIClients', { id: clientId }, {}, function (err, client) {
    if (err) { return done(err) }
    if (!client) { return done(null, false, {message: "API client not found."}) }
    if (client.secret != clientSecret) { return done(null, false) }
    return done(null, client);
  })
}))

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token).  If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(new BearerStrategy(
  function(accessToken, done) {
    APITokens.read({force_admin: true}, 'APITokens', { id: accessToken }, {}, function (err, token) {
      if (err) { return done(err) }
      if (!token) { return done(null, false) }

      if(token.userId != null) {
        Volunteers.read({force_admin: true}, 'Volunteers', { id: token.userId }, {}, function (err, user) {
          if (err) { return done(err) }
          if (!user) { return done(null, false) }
          done(null, user)
        })
      } else {
        //The request came from a client only since userId is null
        //therefore the client is passed back instead of a user
        APIClients.read({force_admin: true}, 'APIClients', { id: token.clientId }, {}, function (err, client) {
          if(err) { return done(err) }
          if(!client) { return done(null, false) }
          done(null, client)
        })
      }
    })
  }
))
