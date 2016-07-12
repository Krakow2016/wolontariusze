
var r = require('rethinkdb')
var async = require('async')
var request = require('request')
var fs = require('fs')

var env = process.env.NODE_ENV || 'development'
var conf = require('./config.json')[env]

// Klucz: tabela, wartość: indeksy
var tables = {
  'APIClients' : ['user_id'],
  'APICodes'   : [],
  'APITokens'  : ['userId'],
  'Activities' : [],
  'Comments'   : [],
  'Imports'    : ['rg_email'],
  'Joints'     : ['activity_id'],
  'Pilgrims'   : ['created_at'],
  'Volunteers' : ['email'],
  'session'    : []
}

// Sprawdź czy środowisko korzysta z bazy RethinkDB
if(conf.service !== 'rethinkdb') {
  console.log('Konfiguracja nie dotyczy RethinkDB, pomijam.')
  return process.exit(0)
}

// Połącz się z testową bazą
r.connect({host: conf.rethinkdb.host}, function(err, conn) {
  if(err) {
    console.log('Błąd: brak połączenia z bazą RethinkDB')
    return process.exit(1)
  }

  return new Promise(function(resolve, reject) {
    // ElasticSearch index
    // settings for ngram search https://www.elastic.co/guide/en/elasticsearch/guide/current/_index_time_search_as_you_type.html
    // https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-ngram-tokenizer.html
    request({
      method: 'PUT',
      uri: conf.elasticSearch,
      body: fs.readFileSync('./config/es_settings.json', 'utf8') 
    }, function(err) {
      if(err) {
        reject('Błąd: brak połączenia z ElasticSearch.')
      } else {
        resolve(conn)
      }
    })
  }).then(function(conn) {
    return new Promise(function(resolve, reject) {
      // ElasticSearch mapping
      request({
        method: 'PUT',
        uri: conf.elasticSearch +'/_mapping/activity',
        body: fs.readFileSync('./config/es_mapping_activity.json', 'utf8')
      }, function(err, resp, json){
        if(err) {
          reject('Błąd: wystąpił problem przy wgrywaniu mappingu aktywności do ElasticSearch.')
        } else {
          console.log(json)
          resolve(conn)
        }
      })
    })
  }).then(function(conn) {
    return new Promise(function(resolve, reject) {
      // ElasticSearch mapping
      request({
        method: 'PUT',
        uri: conf.elasticSearch +'/_mapping/volunteer',
        body: fs.readFileSync('./config/es_mapping_volunteer.json', 'utf8')
      }, function(err, resp, json){
        if(err) {
          reject('Błąd: wystąpił problem przy wgrywaniu mappingu wolontariusza do ElasticSearch.')
        } else {
          console.log(json)
          resolve(conn)
        }
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
            r.tableCreate(table).run(conn, function() {
              cb()
            })
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
          r.table(table).indexCreate(index).run(conn, function(err){
            if(err) { console.log(err) }
            cb()
          })
        }, done)
      }, function(err) {
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
      r.table('Volunteers').count().run(conn, function(err, count) {
        if(count === 0) {
          // Dane dla tabeli wolontariuszy
          var arr = []
          var data = require('./app/services/static/volunteers.json')
          Object.keys(data).forEach(function(key) { arr.push(data[key]) })
          r.table('Volunteers').insert(arr).run(conn, function() {
            resolve(conn)
          })
        } else { resolve(conn) }
      })
    })
  }).then(function(conn) {
    return new Promise(function(resolve) {
      r.table('Activities').count().run(conn, function(err, count) {
        if(count === 0) {
          // Dane dla tabeli aktywności
          var arr = []
          var data = require('./app/services/static/activities.json')
          Object.keys(data).forEach(function(key) { arr.push(data[key]) })
          r.table('Activities').insert(arr).run(conn, function() {
            resolve(conn)
          })
        } else { resolve(conn) }
      })
    })
  }).then(function(conn) {
    return new Promise(function(resolve) {
      r.table('Joints').count().run(conn, function(err, count) {
        if(count === 0) {
          // Dane dla tabeli połączeń wolontariuszy z aktywnościami
          var arr = []
          var data = require('./app/services/static/joints.json')
          Object.keys(data).forEach(function(key) { arr.push(data[key]) })
          r.table('Joints').insert(arr).run(conn, function(err) {
            resolve(conn)
          })
        } else { resolve(conn) }
      })
    })
  }).then(function(conn) {
    return new Promise(function(resolve) {
      r.table('APIClients').count().run(conn, function(err, count) {
        if(count === 0) {
          // Dane dla tabeli klientów api
          var arr = []
          var data = require('./app/services/static/apiclients.json')
          Object.keys(data).forEach(function(key) { arr.push(data[key]) })
          r.table('APIClients').insert(arr).run(conn, function(err) {
            resolve(conn)
          })
        } else { resolve(conn) }
      })
    })
  }).then(function(conn) {
    return new Promise(function(resolve) {
      r.table('Pilgrims').count().run(conn, function(err, count) {
        if(count === 0) {
          // Dane dla tabeli grup pielgrzymów
          var arr = []
          var data = require('./app/services/static/pilgrims.json')
          Object.keys(data).forEach(function(key) { arr.push(data[key]) })
          r.table('Pilgrims').insert(arr).run(conn, function(err) {
            resolve(conn)
          })
        } else { resolve(conn) }
      })
    })
  }).then(function() {
    console.log('All good.')
    process.exit(0)
  }).catch(function(reason){
    console.log('Failed: '+reason)
    process.exit(1)
  })
})
