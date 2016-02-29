//var configuration = require('../../../config.json')[env]
//var dbConf = configuration.es

var elasticsearch = require('elasticsearch')
var client = new elasticsearch.Client({
  host: 'es:9200',
  log: 'trace'
})

var Activities = module.exports = {
  name: 'ActivitiesES',
  read: function(req, resource, params, config, callback) {

    client.search({
      index: 'sdm',
      type: 'activity',
      body: {
        query: {
          match_all: {}
        }
      },
      size: 100
    }).then(function (resp) {
      var hits = resp.hits.hits;
      callback(null, hits)
    }, function (err) {
      console.trace(err.message);
    })

  }
}
