'use strict';
var gulp = require('gulp');

require('./gulp/app');
require('./gulp/watch');

gulp.task('build', [ 'app' ]);

gulp.task('default', ['build'], function() {
  return gulp.start('serve', 'watch');
});
