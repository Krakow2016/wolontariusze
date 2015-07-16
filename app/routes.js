var showVolonteer = require('./actions').showVolonteer

module.exports = {
    home: {
        path: '/',
        method: 'get',
        handler: require('./components/Index.jsx'),
        action: function (context, payload, done) {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: 'Home | flux-examples | routing' });
            done();
        }
    },

    volonteer: {
        path: '/wolontariusz/:id',
        method: 'get',
        handler: require('./components/Volonteer.jsx'),
        action: function (context, payload, done) {
            var volonteerId  = payload.get('params').get('id');
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: volonteerId + ' [Dynamic Page] | flux-examples | routing' });
            context.executeAction(showVolonteer, { id: volonteerId }, function() {
                done();
            })
        }
    },

    login: {
      path: '/login',
      method: 'get',
      handler: require('./components/Login.jsx'),
      action: function (context, payload, done) {
          context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: 'Home | flux-examples | routing' });
          done();
      }
    }
}

