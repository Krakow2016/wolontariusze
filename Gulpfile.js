'use strict';
var gulp = require('gulp');

require('./gulp/app')
require('./gulp/watch')
require('./gulp/rethinkdb')

gulp.task('build', [ 'app' ]);

gulp.task('default', ['rethinkdb', 'build'], function() {
  return gulp.start('serve', 'watch');
});
