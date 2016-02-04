'use strict'

var gulp = require('gulp')

require('./gulp/app')
require('./gulp/watch')

gulp.task('default', ['app'], function() {
  return gulp.start('serve', 'watch')
})
