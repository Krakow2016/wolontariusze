var React = require('react')
var ActivityEdit = require('./ActivityEdit.jsx')

var ActivityCreate = React.createClass({
  
  render: function () {
    var user = this.user();
    var is_admin = user && user.is_admin;
    var body = {};
    if (is_admin) {
      body = <ActivityEdit context={this.props.context} user={this.user()} creationMode={true} />
    } else {
       body = <h1>Brak dostępu - zaloguj się jako Administrator</h1>
    }
    return ( 
      <div>
        {body}
      </div>
    )
  },
  
  user: function() {
    return this.props.context.getUser()
  },
  
  user_name: function() {
    return this.user() && this.user().first_name
  }

})

/* Module.exports instead of normal dom mounting */
module.exports = ActivityCreate