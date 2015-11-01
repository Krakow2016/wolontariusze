// Polyfill dla fluxible-router
GLOBAL.Object.assign = require('object.assign/polyfill')()

var gutil = require('gulp-util')
var server = require('./server')
var config = require('./config.json')

server.listen(config.port)

gutil.log(gutil.colors.bgGreen('Serwer został uruchomiony i jest dostępny pod adresem: http://127.0.0.1:'+config.port+'/.'))
