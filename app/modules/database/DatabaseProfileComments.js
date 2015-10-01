var volonteers = require('../../services/static/volonteer.js').volonteers;

var updateDatabase = function (volonteerId)
{
}
        
var getComments = function (volonteerId) {
    return volonteers[volonteerId].comments;
};

var findCommentIndex = function (comments, commentId) {
    for (var i = 0; i < comments.length; i++) {
        if (comments[i].id == commentId) {
            return i;
        }
    }
    return -1;
}


var createComment = function (volonteerId, commentText, commentAdminId) {
    var comments = getComments(volonteerId);
    var commentTimestamp = Date.now();
    var length = comments.length;
    var commentId = 1; //default value for first comment
    if (length > 0) {
        commentId = comments[length-1].id+1; 
    }
    comments.push({id: commentId, text: commentText, creationTimestamp: commentTimestamp, adminId: commentAdminId});
    updateDatabase(volonteerId);
    
}

var removeComment = function (volonteerId, commentId) {
    var comments = getComments(volonteerId);
    var index = findCommentIndex(comments, commentId);
    if (index != -1) {
        comments.splice(index,1);
        updateDatabase(volonteerId);
    }  
}

var updateComment = function (volonteerId, commentId, commentText, commentAdminId) {
    var comments = getComments(volonteerId);
    var index = findCommentIndex(comments, commentId);
    if (index != -1) {
        var commentTimestamp = Date.now();
        comments[index] = {id: commentId, text: commentText, creationTimestamp: commentTimestamp, adminId: commentAdminId};
        updateDatabase(volonteerId);
    }  
}
    
    
var DatabaseProfileComments = {
    getComments: getComments,
    createComment: createComment,
    removeComment: removeComment,
    updateComment: updateComment
    
}

module.exports = DatabaseProfileComments;
