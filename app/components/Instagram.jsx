var React = require('react');

var Instagram = React.createClass({
  // getInitialState: function () {
  //
  // },
  //
  // _changeListener: function() {
  //
  // },
  //
  componentDidMount: function() {
    console.log(this.state);
  },
  //
  // componentWillUnmount: function() {
  //
  // },
  render: function(){
    return(
      <h1>WELCOME</h1>
    )
  }
})

var SearchUserAPI = function(username, callback){

  var request = new XMLHttpRequest()
  var params = "clientId=611343ce4afa4af9a09b7421fe553b92&client_secret=e4aa7dd825ec4dfa8e3b9dd1ab8b14b4&grant_type=authorization_code&redirect_uri=http://localhost:7000/instagram&code=" + this.state.code;
  request.open('POST', 'https://api.instagram.com/oauth/access_token', true)
  request.setRequestHeader('Content-Type', 'application/json')
  request.send(params);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {

      var resp = request.responseText
      var json = JSON.parse(resp)

      console.log(json);
    } else {
      console.log("ERROR " + request.status + " in SearchUserAPI");
    }
  }

  request.onerror = function() {
    // There was a connection error of some sort
  }
}

module.exports = Instagram;
