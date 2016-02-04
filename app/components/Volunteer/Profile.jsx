var React = require('react')
var VolunteerShell = require('./Shell.jsx')

var Shell = React.createClass({
  render: function() {
    return (
      <VolunteerShell context={this.props.context}>
        <div className="section group">
          <div className="col span_2_of_4">
            <h1>Języki</h1>
            <form action="#" method="get">
              <input type="text" name="fname" className="form txr" /><br />
              <input type="textarea" name="lname" className="form txr" /><br />
              <input type="submit" value="Submit" />
            </form>
          </div>
          <div className="col span_2_of_4">
            <h1>Chciałbym się zaangażować w:</h1>
            <ul>
              <li>Condimentum ac </li>
              <li>quis scelerisque </li>
              <li>neque consequat a id </li>
              <li>est elementum</li>
              <li>Curae torquent</li>
              <li>malesuada viverra</li>
            </ul>
          </div>
        </div>
        <div className="section group">
          <div className="col span_4_of_4">
            <img src="/img/profile/insta.svg" id="profilie-insta-ico" /><h1>#WYD2016</h1>
          </div>
        </div>
        <div className="section group">
          <div className="col span_1_of_4">
            <img src="/img/insta/1.png" className="profile-insta-photo" />
          </div>
          <div className="col span_1_of_4">
            <img src="/img/insta/2.png" className="profile-insta-photo" />
          </div>
          <div className="col span_1_of_4">
            <img src="/img/insta/3.png" className="profile-insta-photo" />
          </div>
          <div className="col span_1_of_4">
            <div className='profile-insta-photo'>
              <div className='square-content'>
                <div>
                  <h1>Zobacz więcej</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </VolunteerShell>
    )
  }
})

module.exports = Shell
