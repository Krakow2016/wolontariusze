'use strict';
var gulp       = require('gulp'),
    browserify = require('browserify'),
    reactify = require('reactify'),
    through2 = require('through2'),
    debug = require('debug'),
    uglify = require('gulp-uglify')

var bootstrapDebug = debug('Example');
debug.enable('*');

gulp.task('app', function () {

  var production = (process.env.NODE_ENV === 'production')
  var browserified = through2.obj(function(file, enc, next) {
    var b = browserify(file, {
      transform: [reactify],
      basedir: './app/'
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
