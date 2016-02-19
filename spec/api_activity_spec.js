describe('Activity API', function() {
  describe('post /activities/', function() {
    it('should create a activity object', function(done) {
      apiRequest(function(r, cb){
        var body = {
          name: "Nazwa zadania",
          description: "Opis zadania",
          lat_lon: [13, 37]
        }
        r.admin_post('/activities/', body, function(err, resp, json){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(201)
          expect(resp.headers['content-type']).toContain('application/json')

          expect(json.status).toEqual('success')
          // Zwracamy id przydzielony aktywności
          expect(json.data.activity.id).toBeDefined()
          expect(json.data.activity.name).toBe("Nazwa zadania")
          expect(json.data.activity.description).toBe("Opis zadania")
          expect(json.data.activity.lat_lon).toEqual([13, 37])
          expect(json.data.activity.user_id).toBe("2")
          done()
        })
      })
    })
  })

  describe('get /activities', function() {
    it('should list all activities', function(done) {
      apiRequest(function(r, cb){
        r.get('/activities', function(err, resp, body){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(200)
          expect(resp.headers['content-type']).toContain('application/json')

          var parse_json = function() { return JSON.parse(body) }
          expect(parse_json).not.toThrow()

          var json = parse_json()
          expect(json.status).toEqual('success')
          expect(json.data).toBeDefined() // Array
          expect(json.data.activities).toBeDefined()
          done()
        })
      })
    })
  })

  describe('get /activities/:id', function() {
    it('should show a activity object', function(done) {
      apiRequest(function(r, cb){
        r.get('/activities/2', function(err, resp, body){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(200)
          expect(resp.headers['content-type']).toContain('application/json')

          var parse_json = function() { return JSON.parse(body) }
          expect(parse_json).not.toThrow()

          var json = parse_json()
          expect(json.status).toEqual('success')
          expect(json.data).toBeDefined() // Object
          expect(json.data.activity.lat_lon).toEqual([13, 37])
          done()
        })
      })
    })
  })

  describe('post /activities/:id', function() {
    it('should update a activity object', function(done) {
      apiRequest(function(r, cb){
        var body = {
          description: "Zmieniony opis"
        }
        r.admin_post('/activities/1', body, function(err, resp, json){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(200)
          expect(resp.headers['content-type']).toContain('application/json')

          expect(json.status).toEqual('success')
          expect(json.data.activity.description).toBe("Zmieniony opis")
          done()
        })
      })
    })
  })

  describe('delete /activities/:id', function() {
    it('should not delete a activity object without permissions', function(done) {
      apiRequest(function(r, cb){
        r.del('/activities/3', function(err, resp, body) {
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(403)
          expect(resp.headers['content-type']).toContain('application/json')

          var parse_json = function() { return JSON.parse(body) }
          expect(parse_json).not.toThrow()

          var json = parse_json()
          expect(json.status).toEqual('error')
          done()
        })
      })
    })

    it('should allow admin deletion of activity object', function(done) {
      apiRequest(function(r, cb){
        r.admin_del('/activities/3', function(err, resp, body) {
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(200)
          expect(resp.headers['content-type']).toContain('application/json')

          var parse_json = function() { return JSON.parse(body) }
          expect(parse_json).not.toThrow()

          var json = parse_json()
          expect(json.status).toEqual('success')
          done()
        })
      })
    })

    it('should delete requested activity object', function(done) {
      apiRequest(function(r, cb){
        r.get('/activities/3', function(err, resp, body) {
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(404)
          expect(resp.headers['content-type']).toContain('application/json')

          var parse_json = function() { return JSON.parse(body) }
          expect(parse_json).not.toThrow()

          var json = parse_json()
          expect(json.status).toEqual('error')
          done()
        })
      })
    })
  })

  describe('post /activities/:activity_id/join', function() {
    it('should link logged-in volunter to activity', function(done) {
      var body = { }
      apiRequest(function(r, cb){
        r.post('/activities/2/join', body, function(err, resp, json){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(200)
          expect(resp.headers['content-type']).toContain('application/json')

          expect(json.status).toEqual('success')
          expect(json.data.joint.created_at).toBeDefined()
          expect(json.data.joint.activity_id).toBe('2')
          expect(json.data.joint.user_id).toBe('1')
          done()
        })
      })
    })

    it('should update a activity object', function(done) {
      apiRequest(function(r, cb){
        r.get('/activities/2', function(err, resp, body){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(200)
          expect(resp.headers['content-type']).toContain('application/json')

          var parse_json = function() { return JSON.parse(body) }
          expect(parse_json).not.toThrow()

          var json = parse_json()
          expect(json.status).toEqual('success')
          expect(json.data.activity.volunteers.length).toEqual(2)
          expect(json.data.activity.volunteers[0].user_id).toEqual('1')
          done()
        })
      })
    })
  })

  describe('post /activities/:activity_id/leave', function() {
    it('should unlink volunter from activity', function(done) {
      var body = { }
      apiRequest(function(r, cb){
        r.post('/activities/2/leave', body, function(err, resp, json){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(200)
          expect(resp.headers['content-type']).toContain('application/json')

          expect(json.status).toEqual('success')
          expect(json.data.joint.updated_at).toBeDefined()
          done()
        })
      })
    })

    it('should update a activity object', function(done) {
      apiRequest(function(r, cb){
        r.get('/activities/2', function(err, resp, body){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(200)
          expect(resp.headers['content-type']).toContain('application/json')

          var parse_json = function() { return JSON.parse(body) }
          expect(parse_json).not.toThrow()

          var json = parse_json()
          expect(json.status).toEqual('success')
          expect(json.data.activity.volunteers.length).toEqual(1)
          done()
        })
      })
    })
  })

  describe('post /joints', function() {
    it('should link any volunter to activity', function(done) {
      var body = {
        user_id: '1'
      }
      apiRequest(function(r, cb){
        r.admin_post('/joints', body, function(err, resp, json){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(201)
          expect(resp.headers['content-type']).toContain('application/json')

          expect(json.data.joint.user_id).toEqual('1')
          done()
        })
      })
    })
  })

  describe('post /joints/:id', function() {
    it('should unlink any volunter from activity', function(done) {
      var body = {
        id: '1',
        user_id: '2'
      }
      apiRequest(function(r, cb){
        r.admin_post('/joints/1', body, function(err, resp, json){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(200)
          expect(resp.headers['content-type']).toContain('application/json')

          expect(json.data.joint.user_id).toEqual('2')
          done()
        })
      })
    })
  })
})
