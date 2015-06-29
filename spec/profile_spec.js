var Volonteer = require('../app/components/Volonteer.jsx')

var React = require('react/addons')
var Fluxible = require('fluxible');
var TestUtils = React.addons.TestUtils

describe("Volonteer profile", function() {

  var volonteer

  beforeEach(function() {
    volonteer = TestUtils.renderIntoDocument(createComponent(Volonteer, {}))
  })

  it("contains volonteer name", function() {
    var label = TestUtils.findRenderedDOMComponentWithClass(volonteer, 'fullName');
    expect(label.getDOMNode().textContent).toEqual('Jan Kowalski');
  })
});
