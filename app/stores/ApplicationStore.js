'use strict'
var createStore = require('fluxible/addons').createStore
var messages = require('../messages')

var ApplicationStore = createStore({
  storeName: 'ApplicationStore',
  handlers: {
    'CHANGE_ROUTE_SUCCESS' : 'handleNavigate',
    'UPDATE_PAGE_TITLE'    : 'updatePageTitle',
    'SAVE_FLASH_SUCCESS'   : 'saveSuccess',
    'SAVE_FLASH_FAILURE'   : 'saveFailure',
    'ADMIN_CONSENT'        : 'setConsent',
    'SET_LANGUAGE'         : 'setLang'
  },

  initialize: function () {
    this.title = ''

    this.messages = messages
  },

  setLang: function(lang) {
    this.lang = lang.match(/pl/) ? 'pl' : 'en'
    this.emitChange()
  },

  saveFailure: function(message) {
    this.flashFailure = message
    this.emitChange()

    var that = this
    setTimeout(function() {
      that.flashFailure = false
      that.emitChange()
    }, 7000)
  },

  saveSuccess: function(message) {
    this.flashSuccess = message
    this.emitChange()

    var that = this
    setTimeout(function() {
      that.flashSuccess = false
      that.emitChange()
    }, 7000)
  },

  getFailure: function() {
    return this.flashFailure
  },

  getSuccess: function() {
    return this.flashSuccess
  },

  updatePageTitle: function (title) {
    this.title = title.title
    this.emitChange()
  },

  getPageTitle: function () {
    return this.title
  },

  setConsent: function() {
    this.consent = true
    this.emitChange()
  },

  getState: function () {
    return {
      currentPageName: this.currentPageName,
      currentPage: this.currentPage,
      pages: this.pages,
      route: this.currentRoute,
      title: this.title,
      flashSuccess: this.flashSuccess,
      flashFailure: this.flashFailure,
      lang: this.lang,
      messages: this.messages
    }
  },

  dehydrate: function () {
    return this.getState()
  },

  rehydrate: function (state) {
    this.currentPageName = state.currentPageName
    this.currentPage = state.currentPage
    this.pages = state.pages
    this.currentRoute = state.route
    this.title = state.title
    this.flashSuccess = state.flashSuccess
    this.flashFailure = state.flashFailure
    this.lang = state.lang

    var that = this
    setTimeout(function() {
      that.flashSuccess = false
      that.flashFailure = false
      that.emitChange()
    }, 7000)
  }
})


module.exports = ApplicationStore
