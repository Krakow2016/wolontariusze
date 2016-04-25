var React = require('react')
var NavLink = require('fluxible-router').NavLink
var Draft = require('draft-js')
var backdraft = require('backdraft-js')
var update = require('react-addons-update')

var TimeService = require('../../modules/time/TimeService.js')

var CommentsStore = require('../../stores/Comments')

var actions = require('../../actions')
var updateAction = actions.profileCommentsUpdate
var deleteAction = actions.profileCommentsDelete

var NewComment = require('../NewComment.jsx')
var Editor = require('../Editor.jsx')

var EditedProfileComment = React.createClass({

  getInitialState: function() {
    var blocks = Draft.convertFromRaw(this.props.comment.raw)
    var contentState = Draft.ContentState.createFromBlockArray(blocks)
    var editorState = Draft.EditorState.createWithContent(contentState)

    return {
      editorState: editorState
    }
  },

  onChange: function(editorState) {
    this.setState({
      editorState: editorState
    })
  },

  handleSave: function() {
    var state = this.state.editorState.getCurrentContent()
    this.props.context.executeAction(updateAction, Object.assign(this.props.comment, {
      raw: Draft.convertToRaw(state),
      editMode: false
    }))
  },

  render: function () {
    return (
      <Editor editorState={this.state.editorState} onChange={this.onChange}>
        <div>
          <input type="submit" onClick={this.handleSave} value="Aktualizuj" />
          <span onClick={this.props.cancel}>Anuluj</span>
        </div>
      </Editor>
    )
  }
})

var ProfileComment = React.createClass ({

  editComment: function() {
    this.props.editComment(this.props.comment.id)
  },

  cancelEditComment: function() {
    this.props.cancelEditComment(this.props.comment.id)
  },

  deleteComment: function () {
    this.props.context.executeAction(deleteAction, this.props.comment)
  },

  render: function (){
    if(this.props.comment.editMode) {
      return (
        <EditedProfileComment
          cancel={this.cancelEditComment}
          comment={this.props.comment}
          context={this.props.context} />
      )
    } else {
      if(!this.props.comment.raw) { return (<div />) }
      var html = backdraft(this.props.comment.raw, {
        'BOLD': ['<strong>', '</strong>'],
        'ITALIC': ['<i>', '</i>'],
        'UNDERLINE': ['<u>', '</u>'],
        'CODE': ['<span style="font-family: monospace">', '</span>'],
      })
      return (
<div>
          <p dangerouslySetInnerHTML={{__html: html}} />
          <div>
            <NavLink href={'/wolontariusz/'+this.props.comment.adminId}>
              {this.full_name()}
            </NavLink>
            {TimeService.showTime(this.props.comment.creationTimestamp)}
          </div>
            <input type="button" onClick={this.editComment} value="Edytuj" />
            <input type="button" onClick={this.deleteComment} value="Usuń" />
          </div>
      )
    }
  },

  full_name: function() {
    return this.props.comment.first_name +' '+ this.props.comment.last_name
  }
})

var ProfileComments = React.createClass({

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
        <ProfileComment
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
            innych koordynatorów - nie są widoczne dla właściciela profilu.
          </p>
        </div>

        <NewComment context={this.props.context} />

        {comments}
      </div>
    )
  }
})

module.exports = ProfileComments
