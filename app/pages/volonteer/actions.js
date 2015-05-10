'use strict'

module.exports = {
    showVolonteer: function(context, payload, cb) {

        var store = context.getStore('VolonteerStore')

        context.service.read('volonteer', payload, {}, function (err, data) {
            context.dispatch('LOAD_VOLONTEER', data);
            cb()
        })
    }
}
