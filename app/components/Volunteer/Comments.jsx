var React = require('react')
var update = require('react-addons-update')

var Comment = require('./Comment.jsx')
var CommentsStore = require('../../stores/Comments')
var NewComment = require('../NewComment.jsx')

var ProfileComments = React.createClass({

  propTypes: {
    context: React.PropTypes.object
  },

  getInitialState: function () {
    return this.props.context.getStore(CommentsStore).getState()
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
    this.setState(this.props.context.getStore(CommentsStore).getState())
  },

  editComment: function(id) {
    var comment = this.state.comments.find(function(c) {
      return c.id === id
    })

    var index = this.state.comments.indexOf(comment)
    comment.editMode = true

    this.setState(update(this.state, {
      comments: {$splice: [[index, 1, comment]]}
    }))
  },

  cancelEdit: function(id) {
    var comment = this.state.comments.find(function(c) {
      return c.id === id
    })

    var index = this.state.comments.indexOf(comment)
    comment.editMode = false

    this.setState(update(this.state, {
      comments: {$splice: [[index, 1, comment]]}
    }))
  },

  render: function (){
    var that = this
    var comments = this.state.comments.map(function(comment) {
      return (
        <Comment
          context={that.props.context}
          comment={comment}
          editComment={that.editComment}
          cancelEditComment={that.cancelEdit}
          key={comment.id} />
      )
    })

    return (
      <div className="profileComments">

        <div className="alert">
          <p>
            Komentarze, które możesz dodawać są widoczne tylko i wyłącznie dla
            innych koordynatorów - nie są widoczne dla wolontariuszy.
          </p>
        </div>

        <NewComment context={this.props.context} />

        {comments}
      </div>
    )
  }
})

module.exports = ProfileComments
