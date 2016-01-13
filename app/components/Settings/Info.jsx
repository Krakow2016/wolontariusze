var React = require('react')

var ProfileSettings = require('./ProfileSettings.jsx')
var MyTextField = require('./../Formsy/MyTextField.jsx')
var VolunteerStore = require('../../stores/Volunteer')

var Info = React.createClass({

  getInitialState: function () {
    return {
      profile: this.props.context.getStore(VolunteerStore).getState().profile,
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
            <label htmlFor="first_name">Doświadczenie</label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField
              id="experience"
              name="experience"
              placeholder="Praktyki w ..."
              value={this.state.profile.experience} />
          </div>
        </div>

        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1-3">
            <label htmlFor="first_name">Zainteresowania</label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField
              id="interests"
              name="interests"
              placeholder="Piłka nożna"
              value={this.state.profile.interests} />
          </div>
        </div>

        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1-3">
            <label htmlFor="first_name">Gdzie chce się angażować</label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField
              id="departments"
              name="departments"
              placeholder="Sekcja tłumaczeń"
              value={this.state.profile.departments} />
          </div>
        </div>
      </ProfileSettings>
    )
  }
})

module.exports = Info
