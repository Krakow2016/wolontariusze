var path = require('path');
var webpack = require('webpack');

module.exports = {
  // or devtool: 'eval' to debug issues with compiled output:
  devtool: 'cheap-module-eval-source-map',
  entry: [
    // listen to code updates emitted by hot middleware:
    'webpack-hot-middleware/client',
    // your code:
    './app/client.js'
  ],
  output: {
    path: path.join(__dirname, 'public', 'js'),
    filename: 'client.js',
    publicPath: '/js/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'app')
    }]
  }
};
