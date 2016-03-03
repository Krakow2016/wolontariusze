var React = require('react')
var NavLink = require('fluxible-router').NavLink

var VolunteerStore = require('../../stores/Volunteer')
var ApplicationStore = require('../../stores/ApplicationStore')
var updateVolunteer = require('../../actions').updateVolunteer

var InstagramSetting = React.createClass({

  getInitialState: function () {
    return this.props.context.getStore(VolunteerStore).profile
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
    this.props.context.executeAction(updateVolunteer, Object.assign(this.state, {
      instagram: null
    }))

  },

  render: function() {
    var insta_state
    var config = this.props.context.getStore(ApplicationStore)

    if(this.state.instagram && this.state.instagram.id) {
      insta_state = (
        <input type="button" value="Usuń" onClick={this.removeInstagram} />
      )
    } else {
      insta_state = (
        <a href={'https://api.instagram.com/oauth/authorize/?client_id='+ config.instagram_client_id +'&redirect_uri=https://wolontariusze.krakow2016.com/instagram&response_type=code'}>
          Zaloguj się
        </a>
      )
    }

    return (
      <p>Instagram - {insta_state}</p>
    )
  }
})

module.exports = InstagramSetting
