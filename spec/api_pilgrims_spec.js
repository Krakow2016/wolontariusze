describe('Pilgrims API', function() {
  describe('get /pilgrims/', function() {
    it('should return full pilgrims database', function(done) {
      apiRequest(function(r, cb){
        r.get('/pilgrims', function(err, resp, body){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(200)
          expect(resp.headers['content-type']).toContain('application/json')

          var parse_json = function() { return JSON.parse(body) }
          expect(parse_json).not.toThrow()

          var json = parse_json()
          expect(json.status).toEqual('success')
          expect(json.data).toBeDefined() // Array
          expect(json.data.pilgrims).toBeDefined() // Object
          done()
        })
      })
    })
  })
})
