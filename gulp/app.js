'use strict';
var gulp       = require('gulp'),
    browserify = require('browserify'),
    reactify = require('reactify'),
    through2 = require('through2'),
    debug = require('debug')

var bootstrapDebug = debug('Example');
debug.enable('*');

var libs = require('./vendor').libs;

gulp.task('app', function () {

  var browserified = through2.obj(function(file, enc, next) {
    var b = browserify(file, {
      transform: [reactify],
      basedir: './app/'
    })

    // The following requirements are loaded from the vendor bundle
    libs.forEach(function(lib) {
        b.external(lib);
    });

    b.bundle(function(err, res){
      if(err) console.log(err.toString())
      // assumes file.contents is a Buffer
      file.contents = res;
      next(null, file);
    })
  })

  return gulp.src('./client.js')
    .pipe(browserified)
    .pipe(gulp.dest('./public/js'));

});
