var React = require('react')

var TimeService = require('../modules/time/TimeService.js');

var ReactMarkdown = require('react-markdown');


var ProfileComments = React.createClass({

  removeComment: function (commentId) {
        if (typeof window != 'undefined') {
            var form = document.createElement("form");
            form.setAttribute("method", "post");
            form.setAttribute("action", "/profileCommentRemove");
            
            var volonteerIdField = document.createElement("input");
            volonteerIdField.setAttribute("type", "hidden");
            volonteerIdField.setAttribute("name", "volonteerId");
            volonteerIdField.setAttribute("value", this.props.volonteerId);
            form.appendChild(volonteerIdField);
            var commentIdField = document.createElement("input");
            commentIdField.setAttribute("type", "hidden");
            commentIdField.setAttribute("name", "commentId");
            commentIdField.setAttribute("value", commentId);
            form.appendChild(commentIdField);
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        }
  },
  getInitialState: function () {
    return {
        editId: -1
    };
  },
  editComment: function(commentId) {
        this.setState({editId: commentId});
  },
  cancelEditComment: function () {
        this.setState({editId: -1});
  },
  
  render: function() {
    var self = this;
    var comments = this.props.data.map (function (comment) {
        if (comment.id == self.state.editId) {
            return (
                <tr>
                    <td colSpan="3">
                        <form action="/profileCommentUpdate" method="POST">
                            <textarea id="profileCommentsEditTextarea" type="text" name="comment" defaultValue={comment.text} />
                            <div id="profileCommentsEditToolbar">
                                <input type="button" onClick={self.cancelEditComment} value="Anuluj" />
                                <a href="https://guides.github.com/features/mastering-markdown/">
                                    <input type="button" value="Markdown" />
                                </a>
                                <input type="submit" value="Zapisz" />
                            </div>
                            <input type="hidden" name="volonteerId" value={self.props.volonteerId} />
                            <input type="hidden" name="commentId" value={self.state.editId} />
                            <input type="hidden" name="adminId" value={self.props.adminId} />
                        </form>                      
                    </td>
                </tr>
            )
        } else {
            return (
                <tr>
                    <td>
                        <ReactMarkdown source={comment.text} />
                    </td>
                    <td>{TimeService.showTime(comment.creationTimestamp)}</td>
                    <td><a href={'/wolontariusz/'+comment.adminId}>{comment.adminName}</a>
                        <br></br>
                        <input type="button" onClick={self.editComment.bind(self, comment.id)} value="Edytuj" /> 
                        <input type="button" onClick={self.removeComment.bind(self, comment.id)} value="Usuń" />
                    
                    </td>
                </tr>
            ) 
        }
    });
    
    
    var commentsContent
    var user = this.props.user
    if (user && (user.is_admin)) {
      commentsContent = <ProfileCommentsContent {...this.props} />
    } else {
      commentsContent = <div />
    }

    return (
        <div className="profileComments">
            <div id="profileCommentsAddTitle">
                <b>Dodaj komentarz</b>
            </div>
            <form action="/profileCommentAdd" method="POST">
                <textarea id="profileCommentsAddTextarea" name="comment" placeholder="Dodaj komentarz" />
                <div id="profileCommentsAddToolbar">
                    <a href="https://guides.github.com/features/mastering-markdown/">
                        <input type="button" value="Markdown" />
                    </a>
                    <input type="submit" value="Dodaj" />
                    <input type="hidden" name="volonteerId" value={this.props.volonteerId} />
                    <input type="hidden" name="adminId" value={this.props.adminId} />
                </div>
            </form>
            <br></br>
            <div id="profileCommentsListTitle">
                <b>Lista komentarzy</b>
            </div>
            <table>
                {comments}
            </table>
        </div>
    )
  }
})

module.exports = ProfileComments
