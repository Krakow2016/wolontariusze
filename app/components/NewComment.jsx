var React = require('react')
var Draft = require('draft-js')

var createComment = require('../actions').createComment
var NewCommentStore = require('../stores/NewComment')
var Editor = require('./Editor.jsx')

var addons = require('fluxible-addons-react')
var connectToStores = addons.connectToStores

var NewComment = React.createClass ({

  propTypes: {
    context: React.PropTypes.object
  },

  getInitialState: function() {
    return this.props.context.getStore(NewCommentStore).getState()
  },

  componentDidMount: function componentDidMount() {
    // Nasłuchuj zmiań na zasobie nowego komentarza. Nastąpi ona po zapisaniu
    // go w bazie danych.
    this.props.context.getStore(NewCommentStore).addChangeListener(this._onStoreChange)
  },

  componentWillUnmount: function componentWillUnmount() {
    // Usuń funkcję nasłychującą.
    this.props.context.getStore(NewCommentStore).removeChangeListener(this._onStoreChange)
  },

  _onStoreChange: function() {
    // Nastąpiła zmiana w stanie zasobu nowego komentarza - uaktualij widok.
    var store = this.props.context.getStore(NewCommentStore)
    this.setState({
      volunteerId: store.getState().volunteerId
    })
  },

  onChange: function(editorState) {
    this.setState({
      editorState: editorState
    })
  },

  handleSave: function (comment) {
    var state = this.state.editorState.getCurrentContent()
    this.props.context.executeAction(createComment, {
      raw: Draft.convertToRaw(state),
      volunteerId: this.state.volunteerId
    })

    var editorState = Draft.EditorState.push(this.state.editorState, Draft.ContentState.createFromText(''))
    this.setState({
      editorState: editorState
    })
  },

  render: function() {
    return (
      <Editor editorState={this.state.editorState} onChange={this.onChange}>
        <p className="text--right">
          <input type="submit" onClick={this.handleSave} value="Dodaj komentarz" />
        </p>
      </Editor>
    )
  }
})

module.exports = NewComment
