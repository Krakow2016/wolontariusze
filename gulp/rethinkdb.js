'use strict'

var gulp = require('gulp')
var r = require('rethinkdb')

var env = process.env.NODE_ENV || 'development'
var conf = require('../config.json')[env]

gulp.task('rethinkdb', function (cb) {

  // Sprawdź czy środowisko korzysta z bazy RethinkDB
  if(conf.service !== 'rethinkdb') {
    return
  }

  new Promise(function(resolve, reject) {
    // Połącz się z testową bazą
    r.connect({}, function(err, conn) {
      if(err) { reject(err) }
      else { resolve(conn) }
    })
  }).then(function(conn) {
    // Stwórz nową bazę danych
    return new Promise(function(resolve) {
      r.dbCreate(conf.rethinkdb.db).run(conn, function(){
        resolve()
      })
    })
  }).then(function() {
    // Utwórz połączenie z nową bazą danych
    return new Promise(function(resolve) {
      r.connect(conf.rethinkdb, function(err, conn) {
        if(err) { reject(err) }
        else {
          // Utwórz tabele w bazie danych
          r.tableCreate('Volonteers').run(conn, function() {
            resolve(conn)
          })
        }
      })
    })
  }).then(function(conn) {
    // Tylko jeżeli nie wystąpił błąd - to znaczy tablica jest pusta
    return new Promise(function(resolve, reject){
      r.table('Volonteers').insert({
        first_name: 'Faustyna',
        last_name: 'Kowalska',
        email: 'faustyna@example.com',
        password: '$2a$10$187mc9Xr6Va6W14Yh.RJLeJtsmKDUUCe41gT8.U3YoIwZsOgqTRr2', // faustyna
        is_admin: true,
        approved: true
      }).run(conn, function(){
        resolve(conn)
      })
    })
  }).then(function(conn) {
    return new Promise(function(resolve) {
      // Utwórz tabele w bazie danych
      r.tableCreate('Activities').run(conn, function() {
        resolve(conn)
      })
    })
  }).then(function(conn) {
    // Tylko jeżeli nie wystąpił błąd - to znaczy tablica jest pusta
    return new Promise(function(resolve, reject){
      r.table('Activities').insert({
        id: '10',
        title: 'Aktywność 10',
        description: 'Treść aktywności 10',
        creationTimestamp: 1000,
        editionTimestamp: 2000,
        startEventTimestamp: 3000,
        duration: '3h',
        place: 'Kraków',
        creator: {id: '', name: '', email: ''},
        editor: {id: '', name: '', email: ''},
        maxVolonteers: 2,
        activeVolonteers: []
      }).run(conn, function(){
        resolve(conn)
      })
    })
  }).then(function(conn) {
    return new Promise(function(resolve) {
      // Utwórz tabele w bazie danych
      r.tableCreate('Joints').run(conn, function(err, resp) {
        // Utwórz indeks w bazie danych
        r.table('Joints').indexCreate('activity_id').run(conn, function() {
          resolve(conn)
        })
      })
    })
  }).then(function(conn){
    r.tableCreate('Comments').run(conn, function(err, resp) {
      // utwórz indeksy
      r.table('Volonteers').indexCreate('email').run(conn, function(err, resp) {
        //if(err) { console.log(err) }
        r.table('Volonteers').indexCreate('token', function(user) {
          return user('access_tokens').map(function(token) {
            return token('token')
          })
        }, {multi: true}).run(conn, function(err, resp) {
          r.tableCreate('APIClients').run(conn, function(err, resp) {
            r.table('APIClients').indexCreate('user_id').run(conn, function(err, resp) {
              r.tableCreate('APICodes').run(conn, function(err, resp) {
                r.tableCreate('APITokens').run(conn, function(err, resp) {
                  r.table('APITokens').indexCreate('userId').run(conn, function(err, resp) {
                    r.table('APIClients').insert({
                      id: 'foo',
                      secret: 'bar',
                      name: 'Testowy klient API',
                      callback_url: 'https://developers.google.com/oauthplayground'
                    }).run(conn, function(err, resp){
                      cb()
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  }).catch(function(reason){
    console.log('Failed: '+reason)
  })
})
