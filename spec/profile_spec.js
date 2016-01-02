var ReactTestUtils = require('react-addons-test-utils');
var Volunteer = require('../app/components/Volunteer.jsx')

describe("Volunteer profile", function() {
  var volunteer

  beforeEach(function() {
    volunteer = ReactTestUtils.renderIntoDocument(createComponent(Volunteer, {}))
  })

  it("contains volunteer name", function() {
    var label = ReactTestUtils.findRenderedDOMComponentWithClass(volunteer, 'fullName');
    expect(label.textContent).toEqual('Jan Kowalski');
  })
})
