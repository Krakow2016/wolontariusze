var React = require('react')
var actions = require('../actions')
var TimeService = require('../modules/time/TimeService.js');

var ReactMarkdown = require('react-markdown');

var ProfileCommentsStore = require('../stores/ProfileCommentsStore')
var createAction = actions.profileCommentsCreate;
var updateAction = actions.profileCommentsUpdate;
var deleteAction = actions.profileCommentsDelete;



var EditedProfileComment = React.createClass({
    getInitialState: function () {
        return {
            text: this.props.comment.text
        };
    },
    //http://buildwithreact.com/article/form-elements
    handleChange: function (evt) {
        this.setState({
            text: evt.target.value
        });
    },
    render: function () {
        return (
            <tr>
                <td colSpan="3">
                        <textarea id="profileCommentsEditTextarea" type="text" name="comment" value={this.state.text} onChange={this.handleChange} />
                        <div id="profileCommentsEditToolbar">
                            <input type="button" onClick={this.props.cancelEditComment} value="Anuluj" />
                            <a href="https://guides.github.com/features/mastering-markdown/">
                                <input type="button" value="Markdown" />
                            </a>
                            <input type="button" onClick={this.props.updateComment.bind(null, this.state.text)} value="Zapisz" />
                        </div>                    
                </td>
            </tr>
        )
    }
    
})

var NewProfileComment = React.createClass ({
    getInitialState: function () {
        return {
            text: ""
        };
    },
    //http://buildwithreact.com/article/form-elements
    handleChange: function (evt) {
        this.setState({
            text: evt.target.value
        });
    },
    createComment: function (text) {
        this.props.createComment(text);
        this.setState({text: ""});
    },  
    render: function () {
        return (
            <div>
                <textarea id="profileCommentsAddTextarea" name="comment" placeholder="Dodaj komentarz" value={this.state.text} onChange={this.handleChange} />
                <div id="profileCommentsAddToolbar">
                    <a href="https://guides.github.com/features/mastering-markdown/">
                        <input type="button" value="Markdown" />
                    </a>
                    <input type="submit" onClick={this.createComment.bind(null, this.state.text)} value="Dodaj" />
                </div>
            </div>
        )
    }                         
    
})

var ProfileComment = React.createClass ({

   render: function (){
        return (
            <tr>
                <td>
                    <ReactMarkdown source={this.props.comment.text} />
                </td>
                <td>{TimeService.showTime(this.props.comment.creationTimestamp)}</td>
                <td><a href={'/wolontariusz/'+this.props.comment.adminId}>{this.props.comment.adminName}</a>
                    <br></br>
                    <input type="button" onClick={this.props.editComment.bind(null, this.props.comment.id)} value="Edytuj" /> 
                    <input type="button" onClick={this.props.deleteComment.bind(null, this.props.comment.id)} value="Usuń" />
                
                </td>
            </tr>
        ) 
    }               
})

var ProfileComments = React.createClass({
    
    createComment: function (text) {
        console.log ('create comment');
        this.props.context.executeAction(createAction, {
            volonteerId: this.props.volonteerId,
            text: text,
            adminId: this.props.adminId
        });
        this.setState(this.props.context.getStore(ProfileCommentsStore).getState());  
     },
    editComment: function(commentId) {
        this.setState(this.props.context.getStore(ProfileCommentsStore).getStateWithEdit(commentId));  
    },
    cancelEditComment: function () {
        this.setState(this.props.context.getStore(ProfileCommentsStore).getState());
    },
    updateComment: function (text) {
        console.log ('update comment');
        this.props.context.executeAction(updateAction, {
            volonteerId: this.props.volonteerId,
            commentId: this.state.editId,
            text: text,
            adminId: this.props.adminId
        });
        this.setState(this.props.context.getStore(ProfileCommentsStore).getState());        
     },
    
    deleteComment: function (commentId) {
        console.log ('delete comment');
        this.props.context.executeAction(deleteAction, {
            volonteerId: this.props.volonteerId,
            commentId: commentId
        });
       this.setState(this.props.context.getStore(ProfileCommentsStore).getState());         
     },
  
  getInitialState: function () {
     return this.props.context.getStore(ProfileCommentsStore).getState();
  },
  

  _changeListener: function() {
     this.setState(this.props.context.getStore(ProfileCommentsStore).getState());
  },

  componentDidMount: function() {
    this.props.context.getStore(ProfileCommentsStore).addChangeListener(this._changeListener);
  },
  

  
  render: function (){
    
    
    var comments = this.state.comments.map (function (comment) {
            if (comment.id == this.state.editId) {
                return (<EditedProfileComment comment={comment} volonteerId={this.props.volonteerId} adminId={this.props.adminId} context={this.props.context} cancelEditComment={this.cancelEditComment} updateComment={this.updateComment}/>) 
            }
            else {
                return (<ProfileComment comment={comment} volonteerId={this.props.volonteerId} context={this.props.context} editComment={this.editComment} deleteComment={this.deleteComment}/>)     
            }
        }.bind(this))

    return (
        <div className="profileComments">
            <div id="profileCommentsAddTitle">
                <b>Dodaj komentarz</b>
            </div>
            <NewProfileComment createComment={this.createComment}/>

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
