var React = require('react')
var Instafeed = require('instafeed.js')

var client_id = 'TODO' // TODO

var Instagram = React.createClass({
  componentDidMount: function() {
    var user = this.user()
    if(!user.instagram) { return }

    var access_token = 'TODO' // TODO

    new Instafeed({
      get: 'user',
      userId: user.instagram.id,
      clientId: client_id,
      accessToken: access_token,
      filter: function(image) {
        return image.tags.indexOf('sdm2016') >= 0;
      },
      error: function(err) {
          console.log(err)
      }
    }).run()
  },

  render: function(){
    var user = this.user();
    var insta_content;
    if(typeof user.instagram !== 'undefined'){
      insta_content = [
        <div id="instafeed"></div>
      ];
    }else{
      insta_content = [
        <a href={"https://api.instagram.com/oauth/authorize/?client_id="+ client_id +"&redirect_uri=http://localhost:7000/instagram&response_type=code"}>Zaloguj się do instagrama</a>
      ];
    }
    return(
      <div>
        {insta_content}
      </div>
    );
  },

  user: function() {
    return this.props.context.getUser()
  }
});

module.exports = Instagram
