var actions = require('./actions')

module.exports = {
    home: {
        path: '/',
        method: 'get',
        handler: require('./components/Index.jsx'),
        action: function (context, payload, done) {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: 'Home | flux-examples | routing' });
            context.executeAction(actions.showVolonteers, {}, function() {
                done();
            })
        }
    },

    registration: {
        path: '/rejestracja',
        method: 'get',
        handler: require('./components/Registration.jsx'),
        action: function (context, payload, done) {
            //context.executeAction(actions.showVolonteer, { id: volonteerId }, function() {
                done();
            //})
        }
    },

    volonteer: {
        path: '/wolontariusz/:id',
        method: 'get',
        handler: require('./components/Volonteer.jsx'),
        action: function (context, payload, done) {
            var volonteerId  = payload.get('params').get('id');
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: volonteerId + ' [Dynamic Page] | flux-examples | routing' });
            context.executeAction(actions.showVolonteer, { id: volonteerId }, function() {
                done();
            })
        }
    },

    activity: {
        path: '/aktywnosc/:id',
        method: 'get',
        handler: require('./components/Activity.jsx'),
        action: function (context, payload, done) {
            var activityId  = payload.get('params').get('id');
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: activityId + ' Aktywnosc' });
            context.executeAction(actions.showActivity, { id: activityId }, function() {
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
    },

    account_settings: {
      path: '/ustawienia/konto',
      method: 'get',
      handler: require('./components/Settings.jsx'),
      action: function (context, payload, done) {
        var user = context.getUser()
        if(user) {
          context.dispatch('SHOW_ACCOUNT_SETTINGS');
          context.executeAction(actions.showVolonteer, { id: user.id }, function() {
            done()
          })
        } else {
          done()
        }
      }
    },

    profil_settings: {
      path: '/ustawienia/profil',
      method: 'get',
      handler: require('./components/Settings.jsx'),
      action: function (context, payload, done) {
        var user = context.getUser()
        if(user) {
          context.dispatch('SHOW_PROFILE_SETTINGS');
          context.executeAction(actions.showVolonteer, { id: user.id }, function() {
            done()
          })
        } else {
          done()
        }
      }
    },

    search: {
      path: '/wyszukiwarka',
      method: 'get',
      handler: require('./components/Search.jsx'),
      action: function(context, payload, done) {
        done()
      }
    }
}

