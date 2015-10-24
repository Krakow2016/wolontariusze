// Polyfill dla fluxible-router
GLOBAL.Object.assign = require('object.assign/polyfill')()

var gutil = require('gulp-util')
var server = require('./server')

server.listen(7000)

gutil.log(gutil.colors.bgGreen('Serwer został uruchomiony i jest dostępny pod adresem: http://127.0.0.1:7000/.'))
