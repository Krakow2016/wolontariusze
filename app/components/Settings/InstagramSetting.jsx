var React = require('react')
var NavLink = require('fluxible-router').NavLink

var VolunteerStore = require('../../stores/Volunteer')
var ApplicationStore = require('../../stores/ApplicationStore')
var updateVolunteer = require('../../actions').updateVolunteer
var MyTextField = require('./../Formsy/MyTextField.jsx')
var request = require('superagent')

var InstagramSetting = React.createClass({

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
    this.props.context.executeAction(updateVolunteer, ({
      id: profile.id,
      instagram: null
    }))
  },

  handleSubmit: function(data){
    var that = this
    request
      .post('/instagram')
      .send({
        username: data.name
      })
      .end(function(err, resp){
        if(err) {
          return
        }
        if (resp.status == 200) {
          that.setState({
            instagram: resp.body.result
          })
        } // TODO: obsługa błędów
      })
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
              id="name"
              name="name"
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
