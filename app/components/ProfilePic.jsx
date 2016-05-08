var React = require('react')

var default_src =  '/img/profile/face.svg'

module.exports = React.createClass({
  getInitialState: function() {
    return {
      src: this.props.src || default_src
    }
  },

  onError: function() {
    this.setState({
      src: default_src
    })
  },

  render: function() {
    return (
      <img src={this.state.src} className={this.props.className} onError={this.onError} />
    )
  }
})
