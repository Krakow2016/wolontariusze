var React = require('react')
var Draft = require('draft-js')

var Editor = React.createClass({

  getInitialState: function() {
    return {
      editorState: this.props.editorState
    }
  },

  onChange: function(editorState) {
    this.setState({
      editorState: editorState
    })
  },

  handleSave: function() {
    var state = this.state.editorState.getCurrentContent()
    this.props.onSave(Draft.convertToRaw(state))
  },

  render: function() {
    return (
      <div>
        <div style={{ border: '1px solid #ccc', cursor: 'text', padding: 10 }}>
          <Draft.Editor
            placeholder="Wpisz komentarz..."
            editorState={this.state.editorState}
            onChange={this.onChange} />
        </div>

        <div id="profileCommentsAddToolbar">
          <input type="submit" onClick={this.handleSave} value="Dodaj" />
        </div>
      </div>
    )
  }
})

module.exports = Editor
