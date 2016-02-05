var React = require('react')

var BasicForm = require('./BasicForm.jsx')
var ProfileSettings = require('./ProfileSettings.jsx')
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

  handleSuccessSnackbarClose: function() {
    this.setState({
      success: false
    })
  },

  handleErrorSnackbarClose: function() {
    this.setState({
      error: false
    })
  },

  render: function() {
    return (
      <ProfileSettings
        profileId={this.state.profile.id}
        context={this.props.context}
        success={this.state.success}
        error={this.state.error}
        handleSuccessSnackbarClose={this.handleSuccessSnackbarClose}
        handleErrorSnackbarClose={this.handleErrorSnackbarClose} >

        <BasicForm {...this.state.profile} context={this.props.context} />
      </ProfileSettings>
    )
  }
})

module.exports = Basic
