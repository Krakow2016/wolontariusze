'use strict'
var createStore = require('fluxible/addons').createStore

var ApplicationStore = createStore({
  storeName: 'ApplicationStore',
  handlers: {
    'CHANGE_ROUTE_SUCCESS' : 'handleNavigate',
    'UPDATE_PAGE_TITLE'    : 'updatePageTitle',
    'SAVE_FLASH_SUCCESS'   : 'saveSuccess',
    'SAVE_FLASH_FAILURE'   : 'saveFailure'
  },
  initialize: function () {
    this.pageTitle = ''
  },
  saveFailure: function(message) {
    this.flashFailure = message
    this.emitChange()
  },
  saveSuccess: function(message) {
    this.flashSuccess = message
    this.emitChange()
  },
  getFailure: function() {
    return this.flashFailure
  },
  getSuccess: function() {
    return this.flashSuccess
  },
  updatePageTitle: function (title) {
    this.pageTitle = title.pageTitle
    this.emitChange()
  },
  getPageTitle: function () {
    return this.pageTitle
  },
  getState: function () {
    return {
      currentPageName: this.currentPageName,
      currentPage: this.currentPage,
      pages: this.pages,
      route: this.currentRoute,
      pageTitle: this.pageTitle,
      flashSuccess: this.flashSuccess,
      flashFailure: this.flashFailure
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
    this.pageTitle = state.pageTitle
    this.flashSuccess = state.flashSuccess
    this.flashFailure = state.flashFailure
  }
})


module.exports = ApplicationStore
