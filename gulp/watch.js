'use strict';
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    livereload = require('gulp-livereload');

gulp.task('watch', function() {
  livereload.listen()

  var app = gulp.watch('app/**/{*.js,*.jsx}');
  app.on('change', function(event) {
    gulp.start('app', function() {
      gutil.log(gutil.colors.bgGreen('Reloading...'));
      livereload.changed(event.path);
    });
  });

  var vendor = gulp.watch('node_modules/**/*.js');
  vendor.on('change', function(event) {
    gulp.start('vendor', function() {
      gutil.log(gutil.colors.bgGreen('Reloading...'));
      livereload.changed(event.path);
    });
  });

  gutil.log(gutil.colors.bgGreen('Watching for changes...'));
});
