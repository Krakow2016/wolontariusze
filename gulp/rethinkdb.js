'use strict';
var gulp = require('gulp')
var r = require('rethinkdb')
var conf = require('../config.json')

gulp.task('rethinkdb', function (cb) {

  if(conf.service === 'rethinkdb') {
    r.connect({}, function(err, conn) {
      if(err) { cb(err) }
      // Stwórz bazę danych
      r.dbCreate(conf.rethinkdb.db).run(conn, function(err, resp){
        // Utwórz połączenie z bazą danych
        r.connect(conf.rethinkdb, function(err, conn) {
          if(err) { cb(err) }
          else {
            // utwórz tabele w bazie danych
            r.tableCreate("Volonteers").run(conn, function(err, resp) {
              //if(err) { console.log(err) }
              var callback = function(err, resp) {
                r.tableCreate("Comments").run(conn, function(err, resp) {
                  //if(err) { console.log(err) }
                  // utwórz indeksy
                  r.table("Volonteers").indexCreate("email").run(conn, function(err, resp) {
                    //if(err) { console.log(err) }
                    r.table("Volonteers").indexCreate("token", function(user) {
                      return user("access_tokens").map(function(token) {
                        return token("token")
                      })
                    }, {multi: true}).run(conn, function(err, resp) {
                        ;
                      r.tableCreate("APIClients").run(conn, function(err, resp) {
                        r.tableCreate("APICodes").run(conn, function(err, resp) {
                          r.tableCreate("APITokens").run(conn, function(err, resp) {
                            r.table("APIClients").insert({
                              id: "foo",
                              clientSecret: "bar"
                            }).run(conn, function(err, resp){
                            })
                          })
                        })
                      })
                    })
                  })
                })
              }
              if(err) { callback() }
              else { // Tylko jeżeli nie wystąpił błąd - to znaczy tablica jest pusta
                r.table("Volonteers").insert({
                  first_name: "Faustyna",
                  last_name: "Kowalska",
                  email: "faustyna@example.com",
                  password: "$2a$10$187mc9Xr6Va6W14Yh.RJLeJtsmKDUUCe41gT8.U3YoIwZsOgqTRr2", // faustyna
                  is_admin: true,
                  approved: true
                }).run(conn, callback)
              } 
            })
            
            r.tableCreate("Activities").run(conn, function(err, resp) {
              if(err) { console.log(err) }
              var callback = function(err, resp) {
                cb();
              }
              if(err) { 
                callback(err); }
              else { // Tylko jeżeli nie wystąpił błąd - to znaczy tablica jest pusta
                //var vol = r.table("Volonteers").get(
                r.table("Activities").insert({
                  id: "10",
                  title: "Aktywność 10",
                  content: "Treść aktywności 10",
                  creationTimestamp: 1000,
                  editionTimestamp: 2000,
                  startEventTimestamp: 3000,
                  duration: "3h",
                  place: "Kraków",
                  creatorId: "",
                  editorId: "",
                  maxVolonteers: 2,
                  activeVolonteersIds: []
                }).run(conn, callback)
              } 
            })
          }
        })
      })
    })
  }
})
