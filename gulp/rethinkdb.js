'use strict';
var gulp = require('gulp')
var r = require('rethinkdb')
var conf = require('../config.json')

gulp.task('rethinkdb', function (cb) {

  if(conf.service === 'rethinkdb') {
    // Utwórz połączenie z bazą danych
    r.connect(conf.rethinkdb, function(err, conn) {
      if(err) { cb(err) }
      else {
        // utwórz tabele w bazie danych
        r.tableCreate("Volonteers").run(conn, function(err, resp) {
          //if(err) { console.log(err) }
          if(!err) { // Tylko jeżeli nie wystąpił błąd - to znaczy tablica jest pusta
            r.table("Volonteers").insert({
              first_name: "Faustyna",
              last_name: "Kowalska",
              email: "faustyna@example.com",
              password: "$2a$10$187mc9Xr6Va6W14Yh.RJLeJtsmKDUUCe41gT8.U3YoIwZsOgqTRr2", // faustyna
              is_admin: true
            }).run(conn, function(err, resp) {
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
                    //if(err) { console.log(err) }
                    cb()
                  })
                })
              })
            })
          }
        })
      }
    })
  }
})
