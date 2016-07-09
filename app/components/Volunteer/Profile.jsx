var React = require('react')
var FormattedMessage = require('react-intl').FormattedMessage
var VolunteerShell = require('./Shell.jsx')
var VolunteerStore = require('../../stores/Volunteer')
var Instagram = require('./Instagram.jsx')

var Shell = React.createClass({

  propTypes: {
    context: React.PropTypes.object
  },

  getInitialState: function () {
    return this.props.context.getStore(VolunteerStore).profile
  },

  _changeListener: function() {
    this.replaceState(this.props.context.getStore(VolunteerStore).getState().profile)
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
      <VolunteerShell context={this.props.context} profile={this.state}>
        <div className="row questions">
            <div className="col col4" >
              <FormattedMessage id="profile_question1" tagName="h3" />
              <p>{this.state.who_question}</p>
            </div>
            <div className="col col4" >
              <FormattedMessage id="profile_question2" tagName="h3" />
              <p>{this.state.what_question}</p>
            </div>
            <div className="col col4" >
              <FormattedMessage id="profile_question3" tagName="h3" />
              <p>{this.state.why_question}</p>
            </div>
        </div>

      </VolunteerShell>
    )
  }
})

module.exports = Shell

        // <div className="section row">
        //   <div className="col col12">
        //     <img src="/img/profile/insta.svg" id="profile-insta-ico" /><h1>#KRAKOW2016</h1>
        //   </div>
        // </div>

        // <Instagram user_id={this.state.id} />
