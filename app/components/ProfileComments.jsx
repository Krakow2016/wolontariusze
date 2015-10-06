var React = require('react')
var ReactMarkdown = require('react-markdown');

var TimeService = require('../modules/time/TimeService.js');

var CommentsStore = require('../stores/Comments')

var actions = require('../actions')
var updateAction = actions.profileCommentsUpdate;
var deleteAction = actions.profileCommentsDelete;

var NewComment = require('./NewComment.jsx')

var EditedProfileComment = React.createClass({
  getInitialState: function() {
    return this.props.comment
  },

  handleChange: function (evt) {
    this.setState({
      text: evt.target.value
    });
  },

  update: function() {
    this.props.context.executeAction(updateAction, this.state)
  },

  render: function () {
    return (
      <tr>
        <td colSpan="3">
          <textarea id="profileCommentsEditTextarea" type="text" name="comment" onChange={this.handleChange}>
            {this.state.text}
          </textarea>
          <div id="profileCommentsEditToolbar">
            <input type="button" onClick={this.props.cancel} value="Anuluj" />
            <a href="https://guides.github.com/features/mastering-markdown/">
              <input type="button" value="Markdown" />
            </a>
            <input type="button" onClick={this.update} value="Zapisz" />
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
      return (
        <tr>
          <td>
            <ReactMarkdown source={this.props.comment.text} />
          </td>
          <td>{TimeService.showTime(this.props.comment.creationTimestamp)}</td>
          <td>
            <a href={'/wolontariusz/'+this.props.comment.adminId}>
              {this.full_name()}
            </a>
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
     return this.props.context.getStore(CommentsStore).getState();
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
      return (<ProfileComment context={that.props.context} comment={comment} />)
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
