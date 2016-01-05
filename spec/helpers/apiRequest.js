var request = require('request')
var api = require('../../api')

var Requester = function(close) {
  this.unauth_get = function(path, done) {
    request('http://localhost:3000/api/v2'+path, function(){
      close()
      done.apply(this, arguments)
    })
  }

  this.get = function(path, done) {
    request('http://localhost:3000/api/v2'+path, {
      auth: {
        bearer: 'bearerToken'
      }
    }, function(){
      close()
      done.apply(this, arguments)
    })
  }

  var _post = function(token, path, body, done) {
    request({
      method: 'post',
      url: 'http://localhost:3000/api/v2'+path,
      auth: {
        bearer: token
      },
      json: body
    }, function(){
      close()
      done.apply(this, arguments)
    })
  }

  this.post = function(path, body, done) {
    _post('bearerToken', path, body, done)
  }

  this.admin_post = function(path, body, done) {
    _post('adminToken', path, body, done)
  }
}

// Assing global variable
apiRequest = function(done) {
  var server = api.listen(3000, function() {
    done(new Requester(server.close.bind(this)))
  })
}
