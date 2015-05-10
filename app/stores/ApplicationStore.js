/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';
var createStore = require('fluxible/addons').createStore;
var routesConfig= require('../pages/volonteer/routes')

var ApplicationStore = createStore({
    storeName: 'ApplicationStore',
    handlers: {
        'CHANGE_ROUTE_SUCCESS' : 'handleNavigate',
        'UPDATE_PAGE_TITLE'    : 'updatePageTitle'
    },
    initialize: function () {
        this.pageTitle = '';
    },
    updatePageTitle: function (title) {
        this.pageTitle = title.pageTitle;
        this.emitChange();
    },
    getPageTitle: function () {
        return this.pageTitle;
    },
    getState: function () {
        return {
            currentPageName: this.currentPageName,
            currentPage: this.currentPage,
            pages: this.pages,
            route: this.currentRoute,
            pageTitle: this.pageTitle
        };
    },
    dehydrate: function () {
        return this.getState();
    },
    rehydrate: function (state) {
        this.currentPageName = state.currentPageName;
        this.currentPage = state.currentPage;
        this.pages = state.pages;
        this.currentRoute = state.route;
        this.pageTitle = state.pageTitle;
    }
});


module.exports = ApplicationStore;
