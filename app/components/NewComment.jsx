var React = require('react')
var createComment = require('../actions').createComment
var NewCommentStore = require('../stores/NewComment')

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

  // http://buildwithreact.com/article/form-elements
  handleChange: function (evt) {
    this.setState({
      text: evt.target.value
    })
  },

  save: function () {
    this.props.context.executeAction(createComment, this.state)
  },

  render: function () {
    return (
      <div>
        <textarea id="profileCommentsAddTextarea" name="comment" placeholder="Dodaj komentarz" value={this.state.text} onChange={this.handleChange} />
        <div id="profileCommentsAddToolbar">
          <a href="https://guides.github.com/features/mastering-markdown/">
            <input type="button" value="Markdown" />
          </a>
          <input type="submit" onClick={this.save} value="Dodaj" />
        </div>
      </div>
    )
  }
})

module.exports = NewComment
