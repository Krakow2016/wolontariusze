var React = require('react')

var ProfileSettings = require('./ProfileSettings.jsx')
var MyTextField = require('./MyTextField.jsx')
var VolunteerStore = require('../../stores/Volunteer')

var Basic = React.createClass({

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
            <label htmlFor="first_name">Imię</label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField required
              id="first_name"
              name="first_name"
              placeholder="Faustyna"
              validations="minLength:3"
              validationError="Imię jest wymagane"
              disabled={!!this.state.profile.first_name}
              value={this.state.profile.first_name} />
          </div>
        </div>

        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1-3">
            <label htmlFor="last_name">Nazwisko</label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField required
              id="last_name"
              name="last_name"
              placeholder="Kowalska"
              validations="minLength:3"
              validationError="Nazwisko jest wymagane"
              disabled={!!this.state.profile.last_name}
              value={this.state.profile.last_name} />
          </div>
        </div>

        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1-3">
            <label htmlFor="email">Adres e-mail</label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField required
              id="email"
              type="email"
              name="email"
              validations="isEmail"
              validationError="Adres email jest niepoprawny"
              placeholder="faustyna@kowalska.pl"
              value={this.state.profile.email} />
          </div>
        </div>
      </ProfileSettings>
    )
  }
})

module.exports = Basic
