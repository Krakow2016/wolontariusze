var React = require('react')

var ProfileSettings = require('./ProfileSettings.jsx')
var MyTextField = require('./MyTextarea.jsx')

var Info = React.createClass({
  render: function() {
    return (
      <ProfileSettings profileId={this.props.profile.id} context={this.props.context}>
        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1-3">
            <label htmlFor="first_name">Doświadczenie</label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField
              id="experience"
              name="experience"
              placeholder="Praktyki w ..."
              value={this.props.profile.experience} />
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
              value={this.props.profile.interests} />
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
              value={this.props.profile.departments} />
          </div>
        </div>
      </ProfileSettings>
    )
  }
})

module.exports = Info
