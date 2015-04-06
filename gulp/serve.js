var gulp = require('gulp'),
    gutil = require('gulp-util')

gulp.task('serve', function() {
  var app = require('server.js');
  app.listen(7000);

  gutil.log(gutil.colors.bgGreen('Serwer został uruchomiony i jest dostępny pod adresem: http://127.0.0.1:7000/.'))
});
