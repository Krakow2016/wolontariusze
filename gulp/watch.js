'use strict';
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    gls = require('gulp-live-server');

var server = gls('app.js');

gulp.task('serve', function() {
  // Uruchom aplikacje
  server.start()
  // Obserwuj zmiany w plikach
  gulp.watch('{app.js,server.js}', function() {
    // Przeładuj serwer
    server.start()
  });
})

gulp.task('watch', function() {
  // Obserwuj zmiany w plikach
  var app = gulp.watch('app/**/{*.js,*.jsx}');
  app.on('change', function(event) {
    gulp.start('app', function() {
      gutil.log(gutil.colors.bgGreen('Reloading...'));
      server.start() // Przeładuj serwer
      .then(function(){
        // Poinformuj przeglądarkę o zmianach
        server.notify(event)
      })
    });
  });

  // Obserwuj zmiany w plikach
  var vendor = gulp.watch('node_modules/**/*.js');
  vendor.on('change', function(event) {
    gulp.start('vendor', function() {
      gutil.log(gutil.colors.bgGreen('Reloading...'));
      server.start() // Przeładuj serwer
      .then(function(){
        // Poinformuj przeglądarkę o zmianach
        server.notify(event)
      })
    });
  });

  gutil.log(gutil.colors.bgGreen('Watching for changes...'));
});
