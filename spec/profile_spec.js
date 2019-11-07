var ReactTestUtils = require('react-addons-test-utils');
var Volunteer = require('../app/components/Volunteer/Profile.jsx')

describe("Volunteer profile", function() {
  var volunteer

  beforeEach(function() {
    volunteer = ReactTestUtils.renderIntoDocument(createComponent(Volunteer, {}));

  })

  it("contains volunteer name", function() {
    var label = ReactTestUtils.findRenderedDOMComponentWithClass(volunteer, 'profile-name');
    expect(label.textContent).toEqual('Jan Kowalski');
  })


  it("contains volunteer nationality", function() {
    var nationalityLabel = ReactTestUtils.scryRenderedDOMComponentsWithTag(volunteer,'h2');
    expect(nationalityLabel[0].textContent).toEqual('Kraj: UK');
  })

  it("contains volunteer profile photo", function() {
    var imageComponents = ReactTestUtils.scryRenderedDOMComponentsWithTag(volunteer, 'img');
    expect(imageComponents[0].src).toEqual('file://profilephoto.img/');
  })

  it("contains volunteer tags", function() {
    var h2Components = ReactTestUtils.scryRenderedDOMComponentsWithTag(volunteer, 'h2');
    expect(h2Components[1].textContent).toEqual('Tagi: Wolontariat Plus, Młody Ambasador, Admin');
  })

  it("contains volunteer who questions", function() {
    var pComponents = ReactTestUtils.scryRenderedDOMComponentsWithTag(volunteer, 'p');
    expect(pComponents[0].textContent).toEqual('Lorem ipsum dolor sit amet');
  })

  it("contains volunteer what questions", function() {
    var pComponents = ReactTestUtils.scryRenderedDOMComponentsWithTag(volunteer, 'p');
    expect(pComponents[1].textContent).toEqual('Donec congue condimentum ante');
  })

  it("contains volunteer why questions", function() {
    var pComponents = ReactTestUtils.scryRenderedDOMComponentsWithTag(volunteer, 'p');
    expect(pComponents[2].textContent).toEqual('Etiam massa orci');
  })
})
