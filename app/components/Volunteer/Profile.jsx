var React = require('react')
var VolunteerShell = require('./Shell.jsx')
var VolunteerStore = require('../../stores/Volunteer')

var Shell = React.createClass({

  getInitialState: function () {
    return this.props.context.getStore(VolunteerStore).getState().profile
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(VolunteerStore).getState().profile)
  },

  componentDidMount: function() {
    this.props.context.getStore(VolunteerStore)
      .addChangeListener(this._changeListener)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(VolunteerStore)
      .removeChangeListener(this._changeListener)
  },

  render: function() {
    return (
      <VolunteerShell context={this.props.context}>
        <div className="section group">
            <h1>Kim jestem?</h1>
            <p>{this.state.who_question}</p>
            <h1>Co chciałbym robić w życiu najbardziej?</h1>
            <p>{this.state.what_question}</p>
            <h1>Dlaczego angażuję się w wolontariat ŚDM?</h1>
            <p>{this.state.why_question}</p>
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
