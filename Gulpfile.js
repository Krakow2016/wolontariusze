'use strict';
var gulp = require('gulp');

require('./gulp/app');
require('./gulp/vendor');
require('./gulp/watch');

gulp.task('build', [
  'app',
  'vendor',
]);

gulp.task('default', ['build'], function() {
  return gulp.start('serve', 'watch');
});
