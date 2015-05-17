module.exports = function() {
  var user
  return {
    name: "Passport",
    plugContext: function (options) {
      user = options.user
      return {
        // Method called to allow modification of the component context
        plugComponentContext: function (componentContext) {
          componentContext.getUser = function () {
            return user;
          };
        },
        dehydrate: function () {
          return {user: user}
        },
        rehydrate: function (state) {
          user = state.user
        }
      }
    }
  }
}
