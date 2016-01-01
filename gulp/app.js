'use strict';
var gulp       = require('gulp'),
    browserify = require('browserify'),
    through2 = require('through2'),
    debug = require('debug'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel')

var bootstrapDebug = debug('Example');
debug.enable('*');

gulp.task('app', function () {

  var production = (process.env.NODE_ENV === 'production')
  var browserified = through2.obj(function(file, enc, next) {
    var b = browserify(file, {
      basedir: './app/',
      debug: !production // dołącza source mapy
    }).transform("babelify", {
      presets: ["react"]
    })

    b.bundle(function(err, res){
      if(err) console.log(err.toString())
      // assumes file.contents is a Buffer
      file.contents = res;
      next(null, file);
    })
  })

  var stream = gulp.src('./client.js')
    .pipe(browserified)

  if (production) {
    // If this is a production build, minify it
    stream.pipe(uglify());
  }

  stream.pipe(gulp.dest('./public/js'));
  return stream
})
