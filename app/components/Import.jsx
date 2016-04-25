var React = require('react')

var request = require('superagent')

var Search = React.createClass({
  getInitialState: function() {
    return {
      result: ''
    }
  },

  onSelected: function(e) {
    var that = this
    var r = request.post('/import')
    var files = e.target.files

    for (var i = 0; i < files.length; i++) {
      r.attach('image', files[i])
    }

    r.end(function(err, response){
      that.setState({
        result: response.body
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

          <pre><code>{this.state.result ? JSON.stringify(this.state.result, null, 2) : null}</code></pre>
      </div>
    )
  }
})

module.exports = Search
