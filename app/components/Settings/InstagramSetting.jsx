var React = require('react')
var NavLink = require('fluxible-router').NavLink

var VolunteerStore = require('../../stores/Volunteer')
var ApplicationStore = require('../../stores/ApplicationStore')
var updateVolunteer = require('../../actions').updateVolunteer
var MyTextField = require('./../Formsy/MyTextField.jsx')
var request = require('superagent')

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
      instagram: null,
      insta_state: false
    }))

  },

  handleSubmit: function(data){
    var that = this;
    request
      .get('/instagram')
      .query({username: data.name })
      .end(function(err, resp){
        console.log(resp);
        if(resp.status == 200){
          that.setState({
            'insta_state': true
          });
        }else{
          that.setState({
            'insta_state': false
          });
          that.refs.form.reset();
        }

      })
  },

  render: function() {
    var insta_state
    var config = this.props.context.getStore(ApplicationStore)

    if((this.state.instagram && this.state.instagram.id) || this.state.insta_state) {
      insta_state = (
        <input type="button" value="Usuń" onClick={this.removeInstagram} />
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
