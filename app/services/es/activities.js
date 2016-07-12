//var dbConf = configuration.es
var env = process.env.NODE_ENV || 'development'
var rethinkdbConf = require('../../../config.json')[env].rethinkdb

var _ = require('lodash')
var r = require('rethinkdb')
var elasticsearch = require('elasticsearch')
var client = new elasticsearch.Client({
  host: 'es:9200',
  log: 'error'
})

var Activities = module.exports = {
  name: 'ActivitiesES',

  // Używamy create ze względu na potrzebę przesyłu zapytania w ciele zapytania POST
  create: function(req, resource, params, body, config, callback) {

    body.sort = [{
      'doc.is_urgent' : {
        'order' : 'desc',
        'nested_path' : 'doc',
        'missing' : 0
      }
    }, {
      'doc.datetime' : {
        'order' : 'asc',
        'nested_path' : 'doc',
        'missing' : '_last'
      }
    }]

    var query = {
      index: 'sdm',
      type: 'activity',
      body: body,
      size: params.size || 50,
      from: params.from
    }

    client.search(query)
      .then(function (resp) {
        var totalHits = resp.hits.total
        var hits = resp.hits.hits.map(function(hit) {
          return hit._source.doc
        })
        var authors = _.compact(_.uniq(hits.map(function(hit) {
          return hit.created_by
        })))

        if(authors.length) {
          r.connect(rethinkdbConf, function(error, conn){
            if(error) { // Wystąpił błąd przy połączeniu z bazą danych
              callback(error)
              return
            }

            // Połącz z tablicą wolontariuszy (dane autora)
            var table = r.table('Volunteers')
            table.getAll.apply(table, authors).run(conn, function(err, cursor) {
              if(err) { callback(err) }
              else {
                cursor.toArray(function(err, results){
                  var map = {}
                  results.forEach(function(result) {
                    map[result.id] = _.pick(result, [
                      'id',
                      'first_name',
                      'last_name',
                      'profile_picture_url'
                    ])
                  })
                  callback(null, hits.map(function(hit) {
                    hit.totalHits = totalHits
                    hit.created_by = map[hit.created_by] || {}
                    return hit
                  }))
                })
              }
            })
          })
        } else {
          callback(null, hits)
        }
      })
      .catch(function(err) {
        console.log(err)
        callback(err)
      })

  }
}
