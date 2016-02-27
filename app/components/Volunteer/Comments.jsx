var React = require('react')
var NavLink = require('fluxible-router').NavLink
var Draft = require('draft-js')
var backdraft = require('backdraft-js')

var TimeService = require('../../modules/time/TimeService.js')

var CommentsStore = require('../../stores/Comments')

var actions = require('../../actions')
var updateAction = actions.profileCommentsUpdate
var deleteAction = actions.profileCommentsDelete

var NewComment = require('../NewComment.jsx')
var Editor = require('../Editor.jsx')

var EditedProfileComment = React.createClass({

  update: function(comment) {
    this.props.context.executeAction(updateAction, Object.assign(this.props.comment, {
      raw: comment
    }))
  },

  render: function () {

    var blocks = Draft.convertFromRaw(this.props.comment.raw)
    var contentState = Draft.ContentState.createFromBlockArray(blocks)
    var editorState = Draft.EditorState.createWithContent(contentState)

    return (
      <tr>
        <td colSpan="3">
          <Editor editorState={editorState} onSave={this.update} />
          <div id="profileCommentsEditToolbar">
            <input type="button" onClick={this.props.cancel} value="Anuluj" />
          </div>
        </td>
      </tr>
    )
  }
})

var ProfileComment = React.createClass ({

  getInitialState: function() {
    return {
      editMode: false
    }
  },

  editComment: function() {
    this.setState({
      editMode: true
    })
  },

  cancelEditComment: function () {
    this.setState({
      editMode: false
    })
  },

  deleteComment: function () {
    this.props.context.executeAction(deleteAction, this.props.comment)
  },

  render: function (){
    if(this.state.editMode) {
      return (
        <EditedProfileComment
          cancel={this.cancelEditComment.bind(this)}
          comment={this.props.comment}
          context={this.props.context} />
      )
    } else {
      if(!this.props.comment.raw) { return (<div />) }
      var html = backdraft(this.props.comment.raw, {})
      return (
        <tr>
          <td>
              { html }
          </td>
          <td>{TimeService.showTime(this.props.comment.creationTimestamp)}</td>
          <td>
            <NavLink href={'/wolontariusz/'+this.props.comment.adminId}>
              {this.full_name()}
            </NavLink>
            <br></br>
            <input type="button" onClick={this.editComment} value="Edytuj" />
            <input type="button" onClick={this.deleteComment} value="Usuń" />
          </td>
        </tr>
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

  render: function (){
    var that = this
    var comments = this.state.comments.map(function(comment) {
      return (<ProfileComment context={that.props.context} comment={comment} key={comment.id} />)
    })

    return (
      <div className="profileComments">
        <div id="profileCommentsAddTitle">
          <b>Dodaj komentarz</b>
        </div>
        <NewComment context={this.props.context} />

        <br></br>
        <div id="profileCommentsListTitle">
          <b>Lista komentarzy</b>
        </div>
        <table><tbody>{comments}</tbody></table>
      </div>
    )
  }
})

module.exports = ProfileComments
