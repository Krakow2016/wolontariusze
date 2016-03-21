var React = require('react')
var ProfileImageChange = require('./ProfileImageChange.jsx')
var BasicForm = require('./BasicForm.jsx')
var Disclamer = require('./Disclamer.jsx')

var BasicInfo = function(props) {
  return (
    <div ref={node => node && node.setAttribute('container', '')}>
      <div ref={node => node && node.setAttribute('row', '')}>
        <div ref={node => node && node.setAttribute('column', '7')}>

          <div className="alert">
            <Disclamer />
          </div>

          <Formsy.Form>
            <BasicForm {...props} />
          </Formsy.Form>
        </div>
        <div ref={node => node && node.setAttribute('column', '5')}>

          <div className="pure-u-1 pure-u-md-1-3">
            <label>Twoje zdjęcie</label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <ProfileImageChange context={props.context} src={props.profile_picture_url} />
          </div>
        </div>
      </div>
    </div>
  )
}

module.exports = BasicInfo
