var showActivity = require('./actions').showActivity

module.exports = {
    volonteer: {
        path: '/aktywnosc/:id',
        method: 'get',
        action: function (context, payload, done) {
            var activityId  = payload.get('params').get('id');
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: activityId + ' Aktywnosc' });
            context.executeAction(showActivity, { id: activityId }, function() {
                done();
            })
        }
    },
}

