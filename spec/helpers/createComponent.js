var React = require('react')
var Fluxible = require('fluxible');

var routes = require('../../app/routes')
var RouteStore = require('fluxible-router').RouteStore;
var ApplicationStore = require('../../app/stores/ApplicationStore')
var VolunteerStore = require('../../app/stores/Volunteer')
var ActivitiesStore = require('../../app/stores/Activities')

var passportPlugin = require('../../app/plugins/passportPlugin')

var Application = require('../../app/components/TestApplication.jsx')

// material-ui wymaga tej zmiennej globalnej
global.navigator = {userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'}

// Assing global variable
createComponent = function(component, props, children) {

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var props_children,
      childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props_children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props_children = childArray;
  }

  //console.log( component )
  var app = new Fluxible({
    component: React.createFactory(Application),
    stores: [
      RouteStore.withStaticRoutes(routes),
      ApplicationStore,
      VolunteerStore,
      ActivitiesStore,
    ]
  })

  app.plug(passportPlugin())

  var context = app.createContext({
    user: {}
  })
  var element = app.getComponent()

  props.handler = component
  props.context = context.getComponentContext()

  context.getActionContext().dispatch('LOAD_VOLUNTEER', {
      first_name: "Jan",
      last_name: "Kowalski"
  });

  return element(props, props_children)
}
