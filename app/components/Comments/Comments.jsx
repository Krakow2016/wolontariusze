var React = require('react')
var update = require('react-addons-update')

var Comment = require('./Comment.jsx')
var CommentsStore = require('../../stores/Comments')
var NewComment = require('./NewComment.jsx')

var FormattedMessage = require('react-intl').FormattedMessage

var ProfileComments = React.createClass({

  propTypes: {
    context: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      store: this.props.context.getStore(CommentsStore).getState(),
      page: 1
    }
  },

  componentDidMount: function componentDidMount() {
    this.props.context.getStore(CommentsStore)
      .addChangeListener(this._onStoreChange)
  },

  componentWillUnmount: function componentWillUnmount() {
    // Usuń funkcję nasłychującą.
    this.props.context.getStore(CommentsStore)
      .removeChangeListener(this._onStoreChange)
  },

  _onStoreChange: function() {
    this.setState({
        store: this.props.context.getStore(CommentsStore).getState(),
        page: this.state.page
    })
  },

  editComment: function(id) {
    var comment = this.state.store.comments.find(function(c) {
      return c.id === id
    })

    var index = this.state.store.comments.indexOf(comment)
    comment.editMode = true

    this.setState(update(this.state, {
      store: {
        comments: {$splice: [[index, 1, comment]]}
      }
    }))
  },

  cancelEdit: function(id) {
    var comment = this.state.store.comments.find(function(c) {
      return c.id === id
    })

    var index = this.state.store.comments.indexOf(comment)
    comment.editMode = false

    this.setState(update(this.state, {
      store: {
        comments: {$splice: [[index, 1, comment]]}
      }
    }))
  },

  moreComments: function () {
    var store = this.state.store
    var newPage = this.state.page+1
    this.setState({
        store: store,
        page: newPage
    })
  },

  render: function (){
    var that = this
    var commentsToRender = this.state.store.comments.slice(0, this.state.page*10)
    var comments = commentsToRender.map(function(comment) {
      return (
        <Comment
          context={that.props.context}
          comment={comment}
          editComment={that.editComment}
          cancelEditComment={that.cancelEdit}
          key={comment.id} />
      )
    })
    var moreCommentsButton = []
    if (this.state.store.comments.length > this.state.page * 10 ) {
        moreCommentsButton = <div className="comments-more" onClick={this.moreComments}>
          <b><FormattedMessage id="comments_more" /></b>
        </div>
    }
    return (
      <div className="profileComments">
        <b className="big-text"><FormattedMessage id="comments_header" /> ({this.state.store.comments.length}):</b>
        <NewComment context={this.props.context} />
        <div className="comments-list-space" />
        {comments}
        {moreCommentsButton}
      </div>
    )
  }
})

module.exports = ProfileComments
