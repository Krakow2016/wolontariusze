describe('Activity API', function() {
  describe('unauthorized', function() {
    it('should return 401 error message', function(done) {
      apiRequest(function(r, cb){
        r.unauth_get('/', function(err, resp, body){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(401)
          expect(resp.headers['content-type']).toContain('application/json')

          var parse_json = function() { return JSON.parse(body) }
          expect(parse_json).not.toThrow()

          var json = parse_json()
          expect(json.status).toEqual('error')
          expect(json.type).toEqual('Unauthorized')
          done()
        })
      })
    })
  })

  describe('get /', function() {
    it('should return welcome message', function(done){
      apiRequest(function(r, cb){
        r.get('/', function(err, resp, body){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(200)
          expect(resp.headers['content-type']).toContain('application/json')

          var json = JSON.parse(body)
          expect(json.status).toEqual('success')
          done()
        })
      })
    })
  })

  describe('get /whatever (non existing path)', function() {
    it('should return error', function(done){
      apiRequest(function(r, cb){
        r.get('/whatever', function(err, resp, body){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(404)
          expect(resp.headers['content-type']).toContain('application/json')

          var json = JSON.parse(body)
          expect(json.status).toEqual('error')
          expect(json.type).toEqual('PathNotFound')
          done()
        })
      })
    })
  })
})
