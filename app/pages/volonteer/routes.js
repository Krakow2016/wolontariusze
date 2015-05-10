var showVolonteer = require('./actions').showVolonteer

module.exports = {
    volonteer: {
        path: '/wolontariusz/:id',
        method: 'get',
        action: function (context, payload, done) {
            var volonteerId  = payload.get('params').get('id');
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: volonteerId + ' [Dynamic Page] | flux-examples | routing' });
            context.executeAction(showVolonteer, { id: volonteerId }, function() {
                done();
            })
        }
    },
}

