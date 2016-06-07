var React = require('react')
var NavLink = require('fluxible-router').NavLink

var VolunteerStore = require('../../stores/Volunteer')
var ApplicationStore = require('../../stores/ApplicationStore')
var actions = require('../../actions')
var MyTextField = require('./../Formsy/MyTextField.jsx')

var InstagramSetting = React.createClass({

  propTypes: {
    context: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      instagram: this.props.context.getStore(VolunteerStore).profile.instagram
    }
  },

  _changeListener: function() {
    this.setState(this.getInitialState())
  },

  componentDidMount: function() {
    this.props.context.getStore(VolunteerStore)
      .addChangeListener(this._changeListener)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(VolunteerStore)
      .removeChangeListener(this._changeListener)
  },

  removeInstagram: function() {
    var profile = this.props.context.getStore(VolunteerStore).profile
    this.props.context.executeAction(actions.updateVolunteer, ({
      id: profile.id,
      instagram: null
    }))
  },

  handleSubmit: function(data){
    var profile = Object.assign({}, this.props.context.getStore(VolunteerStore).profile)
    profile.instagram = { username: data.username }
    this.props.context.executeAction(actions.setInstagram, profile)
  },

  render: function() {
    var insta_state
    var config = this.props.context.getStore(ApplicationStore)

    if (this.state.instagram && this.state.instagram.id) {
      insta_state = (
        <div>
          <span><a href={'https://www.instagram.com'+this.state.instagram.username}>{this.state.instagram.username}</a></span>
          <input type="button" value="Usuń" onClick={this.removeInstagram} />
        </div>
      )
    } else {
      insta_state = (
        <Formsy.Form ref="form" className="input-group-container" onSubmit={this.handleSubmit}>
          <div className="input-group-text">
            <MyTextField required
              id="username"
              name="username"
              placeholder="Nazwa użytkownika"
              validations="minLength:3"
              validationError="Nazwa jest wymagana" />
          </div>
          <div className="input-group-btn">
            <button type="submit" className="bg--primary">
              Ustaw
            </button>
          </div>
        </Formsy.Form>
      )
    }

    return (
      <div>Instagram - {insta_state}</div>
    )
  }
})

module.exports = InstagramSetting
