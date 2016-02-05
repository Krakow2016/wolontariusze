var r = require('rethinkdb')
var async = require('async')
var request = require('request')
var fs = require('fs')

var env = process.env.NODE_ENV || 'development'
var conf = require('./config.json')[env]

var tables = {
  // Tabela    : indeksy
  'APIClients' : ['user_id'],
  'APICodes'   : [],
  'APITokens'  : ['userId'],
  'Activities' : [],
  'Comments'   : [],
  'Joints'     : ['activity_id'],
  'Volunteers' : ['email'],
  'Imports'    : ['rg_email']
}

// Sprawdź czy środowisko korzysta z bazy RethinkDB
if(conf.service !== 'rethinkdb') {
  return process.exit(0)
}

// Połącz się z testową bazą
r.connect({host: conf.rethinkdb.host}, function(err, conn) {
  if(err) {
    console.log('Błąd: brak połączenia z bazą RethinkDB')
    return process.exit(1)
  }

  return new Promise(function(resolve) {
    // ElasticSearch index
    request({
      method: 'PUT',
      uri: conf.elasticSearch
    }, function(err) {
      if(err) { return process.exit(1) }
      resolve(conn)
    })
  }).then(function(conn) {
    return new Promise(function(resolve) {
      // ElasticSearch mappings
      request({
        method: 'PUT',
        uri: conf.elasticSearch +'/volunteer/_mapping',
        body: fs.readFileSync('./config/elasticsearch_mappings.json', 'utf8')
      }, function(err, resp, json){
        if(err) { return process.exit(1) }
        resolve(conn)
      })
    })
  }).then(function(conn) {
    // Stwórz nową bazę danych
    return new Promise(function(resolve) {
      r.dbCreate(conf.rethinkdb.db).run(conn, function(){
        resolve()
      })
    })
  }).then(function() {
    // Utwórz połączenie z nową bazą danych
    return new Promise(function(resolve) {
      r.connect(conf.rethinkdb, function(err, conn) {
        if(err) { reject(err) }
        else {
          // Utwórz tabele w bazie danych
          async.each(Object.keys(tables), function(table, cb) {
            r.tableCreate(table).run(conn, cb)
          }, function() {
            resolve(conn)
          })
        }
      })
    })
  }).then(function(conn) {
    return new Promise(function(resolve) {
      async.each(Object.keys(tables), function(table, done) {
        // Utwórz indeksy dla tabel w bazie danych
        async.each(tables[table], function(index, cb) {
          r.table(table).indexCreate(index).run(conn, cb)
        }, done)
      }, function() {
        // Specjalny index dla tokenów dostępu
        r.table('Volunteers').indexCreate("token", function(user) {
          return user('access_tokens').map(function(token) {
            return token('token')
          })
        }, {multi: true}).run(conn, function(err, resp) {
          resolve(conn)
        })
      })
    })
  }).then(function(conn) {
    return new Promise(function(resolve) {
      // TODO: sprawdź czy są jakieś dane w tabeli
      // Dane dla tabeli wolontariuszy
      var arr = []
      var data = require('./app/services/static/volunteers.json')
      Object.keys(data).forEach(function(key) { arr.push(data[key]) })
      r.table('Volunteers').insert(arr).run(conn, function() {
        resolve(conn)
      })
    })
  }).then(function(conn) {
    return new Promise(function(resolve) {
      // Dane dla tabeli aktywności
      var arr = []
      var data = require('./app/services/static/activities.json')
      Object.keys(data).forEach(function(key) { arr.push(data[key]) })
      r.table('Activities').insert(arr).run(conn, function() {
        resolve(conn)
      })
    })
  }).then(function(conn) {
    return new Promise(function(resolve) {
      // Dane dla tabeli połączeń wolontariuszy z aktywnościami
      var arr = []
      var data = require('./app/services/static/joints.json')
      Object.keys(data).forEach(function(key) { arr.push(data[key]) })
      r.table('Joints').insert(arr).run(conn, function(err) {
        resolve(conn)
      })
    })
  }).then(function(conn) {
    return new Promise(function(resolve) {
    // Dane dla tabeli klientów api
      var arr = []
      var data = require('./app/services/static/apiclients.json')
      Object.keys(data).forEach(function(key) { arr.push(data[key]) })
      r.table('APIClients').insert(arr).run(conn, function(err) {
        resolve(conn)
      })
    })
  }).then(function() {
    console.log('All good.')
    process.exit(0)
  }).catch(function(reason){
    console.log('Failed: '+reason)
  })
})
