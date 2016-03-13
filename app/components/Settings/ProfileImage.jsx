var React = require('react')
//var Formsy = require('formsy-react')

var ProfileImage = React.createClass({

  defaultProfileImg : '/img/profile-100x100.jpg',

  render: function () {
    return (
        <img
          src={this.props.src}
          onClick={this.props.onClick}
          className='avatar-img'
          alt=""/>
    )
  }
})

module.exports = ProfileImage
