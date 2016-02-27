var React = require('react')

var createComment = require('../actions').createComment
var NewCommentStore = require('../stores/NewComment')
var Editor = require('./Editor.jsx')

var addons = require('fluxible-addons-react')
var connectToStores = addons.connectToStores

var NewComment = React.createClass ({

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
    this.setState(this.props.context.getStore(NewCommentStore).getState())
  },

  handleSave: function (comment) {
    this.props.context.executeAction(createComment, {
      raw: comment,
      volunteerId: this.state.volunteerId
    })
  },

  render: function() {
    return (
      <div>
        <Editor editorState={this.state.editorState} onSave={this.handleSave} />
      </div>
    )
  }
})

module.exports = NewComment
