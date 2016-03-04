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

    if(this.props.insta_state){
      request
        .get('/instagram/'+ id)
        .end(function(err, resp){
          if(err) {
            that.setState({
              error: err
            })
          } else {
            that.setState({
              media: resp.body
            })
          }
        })
    }
  },

  render: function(){
    var insta_content

    if(this.state.error){

      insta_content = (
        <h3>Wystapił błąd podczas połączenia z Instagram.com</h3>
      )
      console.error(this.state.error);

    }else if(this.state.media) { // Zapytanie wykonane poprawnie
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
    }else if (this.props.insta_state) {
      insta_content = (
        <h3>Ładuję treść poczekaj chwilkę</h3>
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
