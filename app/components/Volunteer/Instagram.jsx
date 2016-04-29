var React = require('react')
var request = require('superagent')

var ApplicationStore = require('../../stores/ApplicationStore')

var Instagram = React.createClass({

  getInitialState: function() {
    return {
      media: null,
    }
  },

  componentDidMount: function() {
    this.loadInstagram(this.props.user_id)
  },

  componentWillReceiveProps: function(props) {
    if(props.user_id !== this.props.user_id) {
      this.loadInstagram(props.user_id)
    }
  },

  loadInstagram: function(id) {
    var that = this

    // Brak skonfigurowanego konta Instagram
    if(!id) { return }

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
        <h4>Podaj swój login w ustawieniach jeżeli chcesz mieć swoje zdjęcia z instagrama na profilu</h4>
      )

    } else if(this.state.media) { // Zapytanie wykonane poprawnie
      if(this.state.media.length > 10){
        this.setState({
          media: this.state.media.splice(9, this.state.media.length - 1)
        })
      }
      var media = this.state.media.map(function(img) {
        return (
          <div className="col col3">
            <a href={img.link}><img src={img.images.low_resolution.url} key={img.id} className="profile-insta-photo"/></a>
          </div>
        )
      })
      insta_content = (
        <div className="row">{ media }</div>
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
