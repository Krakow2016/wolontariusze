'use strict'

// The service code that you write is always executed on the server, but can be
// accessed transparently from actions without any knowledge of whether it's on
// the server or client. Fetchr provides an appropriate abstraction so that you
// can fetch (CRUD) the data needed in your stores using the same exact syntax
// on server and client side.
//
// Więcej: http://fluxible.io/guides/data-services.html
var volunteers = require('./volunteers.json')
var comments = [
  {
    volonteerId: 1,
    id: 1,
    adminId: 1,
    text: 'To jest pierwszy komentarz (W1)',
    creationTimestamp: 1200043
  },
  {
    volonteerId: 2,
    id: 1,
    adminId: 1,
    text: 'To jest pierwszy komentarz (W2)',
    creationTimestamp: 2200043
  },
  {
    volonteerId: 1,
    id: 1,
    adminId: 2,
    text: 'To jest drugi komentarz (W1)',
    creationTimestamp: 3200043
  },
  {
    volonteerId: 2,
    id: 2,
    adminId: 2,
    text: 'To jest drugi komentarz (W2)',
    creationTimestamp: 4200043
  },
  {
    volonteerId: 2,
    id: 3,
    adminId: 1,
    text: 'To jest trzeci komentarz (W2)',
    creationTimestamp: 5200043
  }
]

var getAdminName = function (adminId) {
  var id = adminId+''
  return volunteers[id].first_name
}

//https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
var filteredComments = function (volonteerId) {
  return comments.filter ( function (obj) {
    if (obj.volonteerId && obj.volonteerId == volonteerId) {
      obj.first_name = getAdminName(obj.adminId)
      return true
    } else {
      return false
    }
  })
}

module.exports = {
  name: 'Comments',
  // at least one of the CRUD methods is required
  read: function(req, resource, params, config, callback) {
    var volonteerId = params.volonteerId
    var volonteerComments = filteredComments(volonteerId)
    callback(null, volonteerComments)
  },

  create: function(req, resource, params, body, config, callback) {
    var volonteerId = params.volonteerId
    var user = req.user || config.user
    var adminId = user.id
    var text = params.text
    var timestamp = Date.now()

    var volonteerComments = filteredComments(volonteerId)
    var commentId = 1 //default value for first comment
    var length = volonteerComments.length
    if (length > 0) {
      commentId = volonteerComments[length-1].id+1
    }
    var comment = {
      volonteerId: volonteerId,
      id: commentId,
      adminId: adminId,
      text: text,
      creationTimestamp: timestamp
    }
    comments.push(comment)

    callback(null, comment)
  },

  update: function(req, resource, params, body, config, callback) {
    var volonteerId = params.volonteerId
    var commentId = params.commentId
    var user = req.user || config.user
    var adminId = user.id
    var text = params.text
    var timestamp = Date.now()
    for (var i = 0 ; i < comments.length; i++) {
      if (comments[i].volonteerId == volonteerId && comments[i].id == commentId) {
        comments[i] = ({
          volonteerId: volonteerId,
          id: commentId,
          adminId: adminId,
          text: text,
          creationTimestamp: timestamp})
        break
      }
    }
    var volonteerComments = filteredComments(volonteerId)
    callback(null, volonteerComments)
  },

  delete: function(req, resource, params, config, callback) {
    var volonteerId = params.volonteerId
    var commentId = params.commentId
    for (var i = 0 ; i < comments.length; i++) {
      if (comments[i].volonteerId == volonteerId && comments[i].id == commentId) {
        comments.splice(i,1)
        break
      }
    }
    var volonteerComments = filteredComments(volonteerId)
    callback(null, volonteerComments)
  }

}
