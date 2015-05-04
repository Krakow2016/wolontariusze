module.exports = {
    volonteer: {
        path: '/wolontariusz/:id',
        method: 'get',
        page: 'home',
        label: 'Home',
        action: function (context, payload, done) {
            var pageId = payload.params.id;
            context.dispatch('LOAD_PAGE', { id: pageId });
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: pageId + ' [Dynamic Page] | flux-examples | routing' });
            done();
        }
    },
}

