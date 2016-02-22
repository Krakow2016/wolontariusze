var xls = {

}


module.exports = {
  name: 'Xls',
  // at least one of the CRUD methods is required
  read: function(req, resource, params, config, callback) {
    if(params.id) { // Pobierz krotkę o danym numerze id
      callback(null, integrations[params.id])
    } else { // Pobierz listę krotek
      //clients_by_client_id[params.user_id]
    }
  }
} 