var React = require('react')
var NavLink = require('fluxible-router').NavLink

var VolunteerStore = require('../../stores/Volunteer')
var ApplicationStore = require('../../stores/ApplicationStore')

var InstagramSetting = React.createClass({

  getInitialState: function () {
    return this.props.context.getStore(VolunteerStore).profile
  },

  _changeListener: function() {
    this.replaceState(this.getInitialState())
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
    var insta_state;
    var config = this.props.context.getStore(ApplicationStore)

    if(this.state.instagram == '' || typeof this.state.instagram == 'undefined'){
      insta_state = (
        <a href={'https://api.instagram.com/oauth/authorize/?client_id='+ config.instagram_client_id +'&redirect_uri=http://localhost:7000/instagram&response_type=code'}>
          Zaloguj się
        </a>
      )
    }else{
      insta_state = (
        <a href={'/instagram/remove/' + this.state.id}>
          Usuń
        </a>
      )
    }

    return (
      <p>Instagram - {insta_state}</p>
    )
  }
})

module.exports = InstagramSetting
