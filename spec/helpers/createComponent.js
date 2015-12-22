var React = require('react')
var Fluxible = require('fluxible');

var routes = require('../../app/routes')
var RouteStore = require('fluxible-router').RouteStore;
var ApplicationStore = require('../../app/stores/ApplicationStore')
var VolonteerStore = require('../../app/stores/Volonteer')

var passportPlugin = require('../../app/plugins/passportPlugin')

var Application = require('../../app/components/TestApplication.jsx')

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
      VolonteerStore
    ]
  })

  app.plug(passportPlugin())

  var context = app.createContext({
    user: {}
  })
  var element = app.getComponent()

  props.handler = component
  props.context = context.getComponentContext()

  context.getActionContext().dispatch('LOAD_VOLONTEER', {
      first_name: "Jan",
      last_name: "Kowalski"
  });

  return element(props, props_children)
}
