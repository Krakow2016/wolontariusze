var clients = {
  foo: {
    client_id: 'bar'
  }
}

var clients_by_client_id = {}
Object.keys(clients).forEach(function(key){
  var client = clients[key]
  clients_by_client_id[client.client_id] = client
})

module.exports = {
  name: 'APIClients',
  // at least one of the CRUD methods is required
  read: function(req, resource, params, config, callback) {
    if(params.id) { // Pobierz krotkę o danym numerze id
      callback(null, clients[params.id])
    } else { // Pobierz listę krotek
      clients_by_client_id[params.user_id]
    }
  }
}
