var React = require('react')

var ProfileSettings = require('./ProfileSettings.jsx')
var MyTextarea = require('./../Formsy/MyTextarea.jsx')
var VolunteerStore = require('../../stores/Volunteer')

var Info = React.createClass({

  getInitialState: function () {
    return {
      profile: this.props.context.getStore(VolunteerStore).getState().profile
    }
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(VolunteerStore).getState())
  },

  componentDidMount: function() {
    this.props.context.getStore(VolunteerStore).addChangeListener(this._changeListener)
  },

  componentWillUnmount: function componentWillUnmount() {
    // Usuń funkcję nasłychującą
    this.props.context.getStore(VolunteerStore)
      .removeChangeListener(this._changeListener)
  },

  render: function() {
    return (
      <ProfileSettings
        profileId={this.state.profile.id}
        context={this.props.context}
        success={this.state.success}
        error={this.state.error}>

        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1-3">
            <label htmlFor="first_name">
              <h2>Kim jestem?</h2>
            </label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextarea
              id="who_question"
              name="who_question"
              placeholder=""
              value={this.state.profile.who_question}
              validations={{
                maxLength: 500
              }}
              validationErrors={{
                maxLength: 'Limit znaków wynosi 500.'
              }} />
          </div>
        </div>

        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1-3">
            <label htmlFor="first_name">
              <h2>Co chciałbym robić w życiu najbardziej?</h2>
            </label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextarea
              id="what_question"
              name="what_question"
              placeholder=""
              value={this.state.profile.what_question}
              validations={{
                maxLength: 500
              }}
              validationErrors={{
                maxLength: 'Limit znaków wynosi 500.'
              }} />
          </div>
        </div>

        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1-3">
            <label htmlFor="first_name">
              <h2>Dlaczego angażuję się w wolontariat ŚDM?</h2>
            </label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextarea
              id="why_question"
              name="why_question"
              placeholder=""
              value={this.state.profile.why_question}
              validations={{
                maxLength: 500
              }}
              validationErrors={{
                maxLength: 'Limit znaków wynosi 500.'
              }} />
          </div>
        </div>
      </ProfileSettings>
    )
  }
})

module.exports = Info
