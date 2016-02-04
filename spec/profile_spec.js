var ReactTestUtils = require('react-addons-test-utils');
var Volunteer = require('../app/components/Volunteer/Profile.jsx')

describe("Volunteer profile", function() {
  var volunteer

  beforeEach(function() {
    volunteer = ReactTestUtils.renderIntoDocument(createComponent(Volunteer, {}))
  })

  it("contains volunteer name", function() {
    var label = ReactTestUtils.findRenderedDOMComponentWithClass(volunteer, 'profile-name');
    expect(label.textContent).toEqual('Jan Kowalski');
  })
})
