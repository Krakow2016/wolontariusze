'use strict'

module.exports = {
    showVolonteer: function(context, payload, cb) {
        var user = context.getUser()
        // Flaga przywilejów administratora
        var is_admin = user && user.is_admin
        // Pobierz dane wolontariusza z bazy danych
        context.service.read('volonteer', payload, {is_admin: is_admin}, function (err, data) {
            context.dispatch('LOAD_VOLONTEER', data);
            cb()
        })
    }
}
