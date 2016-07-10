var React = require('react')
var Dropzone = require('react-dropzone')
var FormattedMessage = require('react-intl').FormattedMessage
var ProfilePic = require('../ProfilePic.jsx')
var actions = require('../../actions')

var ProfileImageChange = React.createClass({

  getInitialState : function() {
    return {
      showDropzone: false
    }
  },

  multiple : false,

  onDrop: function (files) {
    this.props.context.executeAction(actions.updateProfilePicture, files)
  },

  onOpenClick: function() {
    this.refs.dropzone.open()
  },

  render: function () {
    var classNameBtn = 'btn-change-avatar' + (this.state.showDropzone && ' hidden'),
      classNameWrapper = 'avatar-change avatar-change-size-'+this.props.size,
      classNameFile = 'field-file hidden',
      classDropzone = 'dropzone' + (!this.state.showDropzone && ' hidden')

    return (
      <div className={classNameWrapper}>
        <ProfilePic src={this.props.src} className="profilePicSettings" onClick={this.onOpenClick} />
        <FormattedMessage id="profile_image_change" tagName="p" />
        <Dropzone ref="dropzone" onDrop={this.onDrop} className={classDropzone}>
          <div>Upuść tu zdjęcie.</div>
        </Dropzone>
      </div>
    )
  }
})

module.exports = ProfileImageChange
