var React = require('react')
var Draft = require('draft-js')
var NavLink = require('fluxible-router').NavLink
var moment = require('moment')
var fromJS = require('immutable').fromJS
var _ = require('lodash')

var actions = require('../../actions')
var updateAction = actions.profileCommentsUpdate
var deleteAction = actions.profileCommentsDelete
var Editor = require('../Editor.jsx')

var EditedProfileComment = React.createClass({

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
      <Editor editorState={this.state.editorState} onChange={this.onChange}>
        <div>
          <input type="submit" onClick={this.handleSave} value="Aktualizuj" />
          <span onClick={this.props.cancel}>Anuluj</span>
        </div>
      </Editor>
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
        <EditedProfileComment
          cancel={this.cancelEditComment}
          comment={this.props.comment}
          context={this.props.context} />
      )
    } else {
      return (
        <div>
          <Editor editorState={this.state.editorState} onChange={this.onChange} readOnly={true} />
          <div>
            <NavLink href={'/wolontariusz/'+this.props.comment.adminId}>
              {this.full_name()}
            </NavLink>
            { moment(this.props.comment.creationTimestamp).calendar() }
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

module.exports = ProfileComment
