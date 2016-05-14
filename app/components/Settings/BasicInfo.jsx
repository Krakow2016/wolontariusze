var React = require('react')
var ProfileImageChange = require('./ProfileImageChange.jsx')
var BasicForm = require('./BasicForm.jsx')
var Disclamer = require('./Disclamer.jsx')

var BasicInfo = function(props) {
  return (
    <div className="container">
      <div className="row">
        <div className="col col7">

          <div className="alert">
            <Disclamer />
          </div>

          <Formsy.Form>
            <BasicForm {...props} />
          </Formsy.Form>
        </div>
        <div className="col col5">
          <div className="pure-u-1 pure-u-md-2-3">
            <ProfileImageChange context={props.context} src={props.profile_picture_url} />
          </div>
        </div>
      </div>
    </div>
  )
}

module.exports = BasicInfo
