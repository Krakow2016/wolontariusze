module.exports = function() {
  var user
  return {
    name: "Passport",
    plugContext: function (options) {
      user = options.user
      var plugGetUser = function (componentContext) {
          componentContext.getUser = function () {
              return user;
          };
      }
      return {
        // Method called to allow modification of the component context
        plugComponentContext: plugGetUser,
        plugActionContext: plugGetUser,
        dehydrate: function () {
          return {user: user}
        },
        rehydrate: function (state) {
          user = state.user
        },
        getUser: function() {
            return user
        }
      }
    }
  }
}
