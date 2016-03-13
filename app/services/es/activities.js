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

    body.sort = [{
      "doc.is_urgent" : {
        "order" : "desc",
        "nested_path" : "doc",
        "missing" : 0
      }
    },
    {
      "doc.datetime" : {
        "order" : "asc",
        "nested_path" : "doc",
        "missing" : "_last"
      }
    }]

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
