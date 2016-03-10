//var configuration = require('../../../config.json')[env]
//var dbConf = configuration.es

var elasticsearch = require('elasticsearch')
var client = new elasticsearch.Client({
  host: 'es:9200',
  log: 'trace'
})

var Activities = module.exports = {
  name: 'ActivitiesES',

  // Używamy create ze względu na potrzebę przesyłu zapytania w ciele zapytania POST
  create: function(req, resource, params, body, config, callback) {

    var query = {
      index: 'sdm',
      type: 'activity',
      body: body,
      size: params.size
    }

    client.search(query)
      .then(function (resp) {
      var hits = resp.hits.hits;
      callback(null, hits)
    }, function (err) {
      console.trace(err.message);
    })

  }
}
