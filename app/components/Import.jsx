var React = require('react')

var request = require('superagent')

var Search = React.createClass({
  getInitialState: function() {
    return {
      result: ""
    }
  },

  onSelected: function(e) {
      var that = this
      var r = request.post('/import')
      var files = e.target.files

      for (var i = 0; i < files.length; i++) {
          file = files[i];
          r.attach('image', file)
      }

      r.end(function(err, response){
          that.setState({
              result: response.text
          })
      })

  },

  render: function() {
    return (
      <div>
          <p>
              Wgraj plik xml
          </p>

          <form  action="upload.php" method="post" encType="multipart/form-data">
              <input type="file" name="fileToUpload" id="fileToUpload" onChange={this.onSelected} multiple="multiple " />
          </form>

          <textarea value={this.state.result} />
      </div>
    )
  }
})

module.exports = Search
