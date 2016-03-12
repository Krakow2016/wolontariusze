'use strict'

var express = require('express')
var gutil = require('gulp-util')
var env = process.env.NODE_ENV || 'development'
var config = require('./config.json')[env]

var app = express()
require('./server')(app).listen(config.port)

gutil.log(gutil.colors.bgGreen('Serwer został uruchomiony i jest dostępny pod adresem: http://127.0.0.1:'+config.port+'/.'))
