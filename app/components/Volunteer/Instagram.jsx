var React = require('react')
var request = require('superagent')

var ApplicationStore = require('../../stores/ApplicationStore')

var Instagram = React.createClass({

  getInitialState: function() {
    return {
      media: null,
      client_id: null
    }
  },

  componentDidMount: function() {
    this.loadInstagram(this.props.user_id)
  },

  componentWillReceiveProps: function(props) {
    this.loadInstagram(props.user_id)
  },

  loadInstagram: function(id) {
    var that = this
    var config = this.props.context.getStore(ApplicationStore)
    this.setState({ client_id: config.instagram_client_id })
    request
      .get('/instagram/'+ id)
      .end(function(err, resp){
        if(err) {
          // Brak integracji
        } else {
          that.setState({
            media: resp.body.data
          })
        }
      })
  },

  render: function(){
    var insta_content

    if(this.state.media) { // Zapytanie wykonane poprawnie
      var media = this.state.media.map(function(img) {
        return (
          <img src={img.images.low_resolution.url} key={img.id} />
        )
      })
      insta_content = (
        <div id='instafeed'>{ media }</div>
      )
    } else { // Użytkownik nie autoryzował nas do wykonywania zapytań
      insta_content = (
        <a href={'https://api.instagram.com/oauth/authorize/?client_id='+ this.state.client_id +'&redirect_uri=http://localhost:7000/instagram&response_type=code'}>
          Zaloguj się do instagrama
        </a>
      )
    }

    return (
      <div>
        {insta_content}
      </div>
    )
  }
})

module.exports = Instagram
