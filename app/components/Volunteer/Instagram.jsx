var React = require('react')
var request = require('superagent')

var ApplicationStore = require('../../stores/ApplicationStore')

var Instagram = React.createClass({

  getInitialState: function() {
    return {
      media: null,
      client_id: this.props.context.getStore(ApplicationStore).instagram_client_id
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

    request
      .get('/instagram/'+ id)
      .end(function(err, resp){
        if(err) {
          that.setState({
            error: err,
            media: null
          })
        } else {
          that.setState({
            error: null,
            media: resp.body.data
          })
        }
      })
  },

  render: function(){
    var insta_content

    if(this.state.error){

      insta_content = (
        <h3>Wystapił błąd podczas połączenia z Instagram.com</h3>
      )

    } else if(this.state.media) { // Zapytanie wykonane poprawnie
      if(this.state.media.length > 10){
        this.setState({
          media: this.state.media.splice(9, this.state.media.length - 1)
        })
      }
      var media = this.state.media.map(function(img) {
        return (
          <div className="col span_1_of_4">
            <a href={img.link}><img src={img.images.low_resolution.url} key={img.id} className="profile-insta-photo"/></a>
          </div>
        )
      })
      insta_content = (
        <div className="section group">{ media }</div>
      )
    } else { // Użytkownik nie autoryzował nas do wykonywania zapytań
      insta_content = (
        <a href={'https://api.instagram.com/oauth/authorize/?client_id='+ this.state.client_id +'&redirect_uri=https://wolontariusze.krakow2016.com/instagram&response_type=code'}>
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
