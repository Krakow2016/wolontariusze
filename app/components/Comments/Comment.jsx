var React = require('react')
var Draft = require('draft-js')
var NavLink = require('fluxible-router').NavLink
var moment = require('moment')
var fromJS = require('immutable').fromJS
var _ = require('lodash')

var actions = require('../../actions')
var updateAction = actions.updateComment
var deleteAction = actions.deleteComment
var Editor = require('../Editor.jsx')

var ProfilePic = require('../ProfilePic.jsx')
var FormattedMessage = require('react-intl').FormattedMessage

var EditedComment = React.createClass({

  propTypes: {
    comment: React.PropTypes.object,
    context: React.PropTypes.object,
    cancel: React.PropTypes.func
  },

  getInitialState: function() {
    var map = this.props.comment.raw.entityMap
    _.forEach(map, function(val, key) {
      val.data.mention = fromJS(val.data.mention)
    })

    var contentState = Draft.convertFromRaw(this.props.comment.raw)
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
      <div className="comment">
        <Editor editorState={this.state.editorState} onChange={this.onChange}>
        </Editor>
        <div className="RichEditor-controls comments-controls-active">
          <span className="RichEditor-styleButton" onClick={this.handleSave} key="handleSave"><FormattedMessage id="comments_update" /></span>
          <span className="RichEditor-styleButton" onClick={this.props.cancel} key="cancel"><FormattedMessage id="comments_cancelEdit" /></span>
        </div>
      </div>
    )
  }
})


var ProfileComment = React.createClass({

  propTypes: {
    editComment: React.PropTypes.func,
    cancelEditComment: React.PropTypes.func,
    comment: React.PropTypes.object,
    context: React.PropTypes.object
  },

  getInitialState: function() {
    if (this.props.comment.raw) {
      var raw = this.props.comment.raw
      _.forEach(raw.entityMap, function(val, key) {
        val.data.mention = fromJS(val.data.mention)
      })
      var content = Draft.convertFromRaw(raw)
      var editorState = Draft.EditorState.createWithContent(content)
      return {
        editorState: editorState
      }
    } else {
      return {
        editorState: Draft.EditorState.createEmpty()
      }
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.comment.raw) {
      var raw = Object.assign({}, nextProps.comment.raw)
      _.forEach(raw.entityMap, function(val, key) {
        val.data.mention = fromJS(val.data.mention)
      })
      var content = Draft.convertFromRaw(raw)
      this.setState({
        editorState: Draft.EditorState.push(this.state.editorState, content)
      })
    }
  },

  onChange: function(editorState) {
    this.setState({
      editorState: editorState
    })
  },

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
        <EditedComment
          cancel={this.cancelEditComment}
          comment={this.props.comment}
          context={this.props.context} />
      )
    } else {
      var buttons=[]
      var isAdmin = this.props.context.getUser().is_admin
      var isOwner = ( this.props.context.getUser().id == this.props.comment.adminId )

      if (isAdmin || isOwner) {
        buttons.push(<span className="RichEditor-styleButton" onClick={this.editComment} key="editComment"><FormattedMessage id="comments_edit" /></span>)
        buttons.push(<span className="RichEditor-styleButton" onClick={this.deleteComment} key="deleteComment"><FormattedMessage id="comments_remove" /></span>)
      }
      return (
        <div className="comment">
          <div className="alert">
            <div className="comments-time">
              <b>{ moment(this.props.comment.creationTimestamp).calendar() }</b>
            </div>
            <div className="row">
              <div className="comments-volonteer-label" >
                <NavLink href={'/wolontariusz/'+this.props.comment.adminId} className="tooltip--bottom" data-hint={this.full_name()} >
                  <ProfilePic src={this.props.comment.thumb_picture_url} className='profileThumbnail' />
                </NavLink>
              </div>
              <div className="comments-text-block">
                <Editor editorState={this.state.editorState} onChange={this.onChange} readOnly={true} />
              </div>
            </div>
          </div>
          <div className="RichEditor-controls comments-controls">
              {buttons}
          </div>
        </div>
      )
    }
  },

  full_name: function() {
    return this.props.comment.first_name +' '+ this.props.comment.last_name
  }
})

module.exports = ProfileComment
