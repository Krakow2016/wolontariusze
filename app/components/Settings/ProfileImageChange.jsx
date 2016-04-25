var React = require('react')
var Dropzone = require('react-dropzone')
var ProfileImage = require('./ProfileImage.jsx')
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
        <ProfileImage src={this.props.src} onClick={this.onOpenClick} />
        <Dropzone ref="dropzone" onDrop={this.onDrop} className={classDropzone}>
          <div>Kliknij aby wybrać lub upuść tu zdjęcie.</div>
        </Dropzone>
      </div>
    )
  }
})

module.exports = ProfileImageChange
