'use strict';
var gulp = require('gulp'),
    browserify = require('browserify'),
    rename = require('gulp-rename'),
    through2 = require('through2');

var libs = [
  'react',
  'fluxible',
  'fluxible-plugin-routr'
];

gulp.task('vendor', function() {
  var production = (process.env.NODE_ENV === 'production');

  var browserified = through2.obj(function(file, enc, next) {
    var b = browserify(file, {
      debug: false,
    })

    // Require vendor libraries and make them available outside
    // the bundle.
    libs.forEach(function(lib) {
      b.require(lib);
    });

    b.bundle(function(err, res){
      // assumes file.contents is a Buffer
      file.contents = res;
      next(null, file);
    })
  })

  // A dummy entry point for browserify
  var stream = gulp.src('./gulp/null.js')

  // Browserify it
  .pipe(browserified)

  //if (production) {
  //// If this is a production build, minify it
  //stream.pipe(uglify());
  //}

  // Give the destination file a name, adding '.min' if this is production
  stream.pipe(rename('vendor' + (production ? '.min' : '') + '.js'))

  // Save to the build directory
  stream.pipe(gulp.dest('./public/js'));

  return stream;
});

exports.libs = libs;
