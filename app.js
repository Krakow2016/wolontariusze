'use strict'

var gutil = require('gulp-util')
var server = require('./server')
var env = process.env.NODE_ENV || 'development'
var config = require('./config.json')[env]

server.listen(config.port)

gutil.log(gutil.colors.bgGreen('Serwer został uruchomiony i jest dostępny pod adresem: http://127.0.0.1:'+config.port+'/.'))
