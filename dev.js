var webpack = require('webpack')
var express = require('express')
var config = require('./webpack.config.dev')

var app = express()
var compiler = webpack(config)

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))

app.use(require('webpack-hot-middleware')(compiler))

require('./server')(app).listen(3000)
