'use strict'

var createStore  = require('fluxible/addons').createStore
var Draft = require('draft-js')
var fromJS = require('immutable').fromJS
var _ = require('lodash')

var NEWS_PER_PAGE = 5

var ActivityStore = createStore({
  storeName: 'Activity',
  handlers: {
    'LOAD_ACTIVITY': 'load',
    'PRECREATE_ACTIVITY': 'precreate',
    'ACTIVITY_DELETED': 'deleted',
    'ACTIVITY_UPDATED': 'update',
    'JOINT_CREATED': 'join',
    'JOINT_DELETED': 'leave',
    'UPDATE_ADDED': 'update_published',
    'LOAD_NEWS_PAGE': 'load_page',
    'NEWS_CHANGED': 'update_published',
    'MORE_ACTIVITY_UPDATES': 'more_updates'
  },

  initialize: function () {
    this.activity = {
      name: '',
      act_type: 'niezdefiniowany',
      place: '',
      is_urgent: false,
      limit: 0,
      parent_id: null
    }
    this.volunteers = []
    this.activityState = Draft.EditorState.createEmpty()
    this.newUpdateState = Draft.EditorState.createEmpty()
    this.updates = []
    this.updatesPage = 1
    this.children = []
    this.parentName = ''
  },

  load: function(data, page) {
    var that = this
    var volunteers = data.volunteers || []
    delete data.volunteers
    this.activity = data
    this.volunteers = volunteers

    _.forEach(data.description.entityMap, function(val, key) {
      val.data.mention = fromJS(val.data.mention)
    })

    // Opis zadania
    var contentState = Draft.convertFromRaw(data.description)
    this.activityState = Draft.EditorState.push(this.activityState, Draft.ContentState.createFromBlockArray(contentState.getBlocksAsArray()))

    // Aktualizacje
    this.updates = data.updates
    this.updatesPage = 1

    // Nadzadanie
    this.parentName = data.parentName

    // Podzadania
    this.children = data.children

    this.emitChange()
  },

  precreate: function(data) {
    this.initialize()
    this.activity.parent_id=data.parent_id
    this.emitChange()
  },

  deleted: function (data) {
    this.initialize()
    this.emitChange()
  },

  join: function(joint) {
    this.volunteers.push(joint)
    this.emitChange()
  },

  leave: function(id) {
    // Usuń obiekt połączenia
    this.volunteers = this.volunteers.filter(function(volunteer) {
      return volunteer.id !== id
    })
    this.emitChange()
  },

  create: function(data) {
    // TODO
    //this.rehydrate(data)
    this.emitChange()
  },

  update: function(data) {
    Object.assign(this.activity, data)
    this.emitChange()
  },

  update_published: function(updates) {
    this.updates = updates
    this.newUpdateState = Draft.EditorState.createEmpty()
    this.emitChange()
  },

  load_page: function(page) {
    if (page) {
      this.updatesPage = page
    }
    this.emitChange()
  },

  more_updates: function (data) {
    var that = this
    //console.log ('MORE UPDATES', updates)
    //var size = (this.activity.updates_size%NEWS_PER_PAGE == 0) ? NEWS_PER_PAGE : this.activity.updates_size%NEWS_PER_PAGE
    //var newUpdates = updates.slice(0, NEWS_PER_PAGE)
    data.updates.forEach(function(update){
      that.updates.push(update)
    })
    this.updatesPage = data.page
    this.emitChange()
  },
  
  getState: function () {
    return {
      activity: this.activity,
      activityState: this.activityState,
      volunteers: this.volunteers,
      updates: this.updates,
      newUpdateState: this.newUpdateState,
      updatesPage: this.updatesPage,
      children: this.children,
      parentName: this.parentName
    }
  },

  dehydrate: function () {
    return {
      activity: this.activity,
      volunteers: this.volunteers,
      activityState: Draft.convertToRaw(this.activityState.getCurrentContent()),
      newUpdateState: Draft.convertToRaw(this.newUpdateState.getCurrentContent()),
      updates: this.updates,
      updatesPage: this.updatesPage,
      children: this.children,
      parentName: this.parentName
    }
  },

  rehydrate: function (state) {
    this.activity = state.activity
    this.volunteers = state.volunteers
    this.updates = state.updates
    this.updatesPage = state.updatesPage
    this.children = state.children
    this.parentName = state.parentName

    _.forEach(state.activityState.entityMap, function(val, key) {
      val.data.mention = fromJS(val.data.mention)
    })

    var contentState = Draft.convertFromRaw(state.activityState)
    this.activityState = Draft.EditorState.push(this.activityState, Draft.ContentState.createFromBlockArray(contentState.getBlocksAsArray()))

    // Formularz aktualizacji do zadania
    var contentState2 = Draft.convertFromRaw(state.newUpdateState)
    this.newUpdateState = Draft.EditorState.push(this.newUpdateState, Draft.ContentState.createFromBlockArray(contentState2.getBlocksAsArray()))
  }

})

ActivityStore.attributes = function() {
  return [
    'id',
    'parent_id',
    'parentName',
    'children',
    'act_type',
    'created_at',
    'created_by',
    'datetime',
    'description',
    'endtime',
    'is_archived',
    'is_private',
    'is_urgent',
    'is_public',
    'lat_lon',
    'limit',
    'name',
    'place',
    'starts_at',
    'tags',
    'updated_at',
    'updates',
    'updates_size',
    'volunteers',
    // dane autora (pochodzą z joina)
    'first_name',
    'last_name',
    'profile_picture_url'
  ]
}

module.exports = ActivityStore
