describe('Volunteer API', function() {
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

  describe('post /volunteers/', function() {
    it('should create a volounteer object', function(done) {
      apiRequest(function(r, cb){
        var body = {
          first_name: 'Janusz',
          last_name: 'Testowy'
        }
        r.admin_post('/volunteers/', body, function(err, resp, json){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(201)
          expect(resp.headers['content-type']).toContain('application/json')

          expect(json.status).toEqual('success')
          // Zwracamy id przydzielony wolontariuszowi
          expect(json.data.volunteer.id).toBeDefined()
          done()
        })
      })
    })

    it('should not create a volounteer object without permissions', function(done) {
      apiRequest(function(r, cb){
        var body = {
          first_name: 'Janusz',
          last_name: 'Testowy'
        }
        r.post('/volunteers/', body, function(err, resp, json){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(403)
          expect(resp.headers['content-type']).toContain('application/json')

          expect(json.status).toEqual('error')
          expect(json.type).toEqual('AdminRequired')
          done()
        })
      })
    })
  })

  describe('get /volunteers', function() {
    it('should list all volunteers', function(done) {
      apiRequest(function(r, cb){
        r.get('/volunteers', function(err, resp, body){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(200)
          expect(resp.headers['content-type']).toContain('application/json')

          var parse_json = function() { return JSON.parse(body) }
          expect(parse_json).not.toThrow()

          var json = parse_json()
          expect(json.status).toEqual('success')
          expect(json.data).toBeDefined() // Array
          expect(json.data.volunteers).toBeDefined()

          done()
        })
      })
    })
  })

  describe('get /volunteers/:id', function() {
    it('show a volounteer object', function(done) {
      apiRequest(function(r, cb){
        r.get('/volunteers/2', function(err, resp, body){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(200)
          expect(resp.headers['content-type']).toContain('application/json')

          var parse_json = function() { return JSON.parse(body) }
          expect(parse_json).not.toThrow()

          var json = parse_json()
          expect(json.status).toEqual('success')
          expect(json.data).toBeDefined() // Object

          // Sprawdź imię i nazwisko
          expect(json.data.volunteer.first_name).toBe('Karol')
          expect(json.data.volunteer.last_name).toBe('Wojtyła')

          // Upewnij się że nie ujawniamy wrażliwych danych
          expect(json.data.volunteer.password).not.toBeDefined()

          done()
        })
      })
    })
  })

  describe('post /volunteers/:id', function() {
    // Edytujemy własny profil
    it('should update a volounteer object', function(done) {
      apiRequest(function(r, cb){
        var body = {
          phone: '+48111222333',
        }
        r.post('/volunteers/1', body, function(err, resp, json){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(200)
          expect(resp.headers['content-type']).toContain('application/json')

          expect(json.status).toEqual('success')
          expect(json.data.volunteer.id).toEqual('1')
          expect(json.data.volunteer.phone).toEqual('+48111222333')
          done()
        })
      })
    })

    // Edytujemy nie swój profil
    it('should not update any volounteer object', function(done) {
      apiRequest(function(r, cb){
        var body = {
          phone: '+48111222333',
        }
        r.post('/volunteers/2', body, function(err, resp, json){
          expect(err).toBeNull()
          expect(resp.statusCode).toEqual(403)
          expect(resp.headers['content-type']).toContain('application/json')

          expect(json.status).toEqual('error')
          expect(json.type).toEqual('AdminRequired')
          done()
        })
      })
    })
  })
})
