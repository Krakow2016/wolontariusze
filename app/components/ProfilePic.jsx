var React = require('react')

module.exports = function(props) {
  var src = props.src || '/img/profile/face.svg'
  return (
    <img src={src} className={props.className} />
  )
}
