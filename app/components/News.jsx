
var React = require('react')
var NavLink = require('fluxible-router').NavLink
var Draft = require('draft-js')
var fromJS = require('immutable').fromJS
var _ = require('lodash')
var moment = require('moment')
var FormattedMessage = require('react-intl').FormattedMessage

var Editor = require('./Editor.jsx')
var ProfilePic = require('./ProfilePic.jsx')
var ActivityStore = require('../stores/Activity')
var actions = require('../actions')
var update = require('react-addons-update')
var navigateAction = require('fluxible-router').navigateAction

var NEWS_PER_PAGE = 5

var NewsItem = React.createClass({

  getInitialState: function() {
    var map = this.props.raw.entityMap
    _.forEach(map, function(val, key) {
      val.data.mention = fromJS(val.data.mention)
    })

    var contentState = Draft.convertFromRaw(this.props.raw)
    var editorState = Draft.EditorState.createWithContent(contentState)

    return {
      editorState: editorState,
      savedEditorState: editorState,
      isEdited: false
    }
  },

  onChange: function(editorState) {
    this.setState(update(this.state, {
      editorState: {$set: editorState}
    }))
  },

  edit: function () {
    this.setState(update(this.state, {
      isEdited: {$set: true}
    }))
  },

  remove: function () {
    this.setState(update(this.state, {
      isEdited: {$set: false}
    }))
    this.props.handleUpdatesChange(this.props.index, 
        { toBeRemoved: true })
  },

  cancel: function () {
    this.setState(update(this.state, {
      isEdited: {$set: false},
      editorState: {$set: this.state.savedEditorState}
    }))
  },

  save: function () {
    this.setState(update(this.state, {
      isEdited: {$set: false},
      savedEditorState: {$set: this.state.editorState}
    }))
    this.props.handleUpdatesChange(this.props.index, 
        {raw: Draft.convertToRaw(this.state.editorState.getCurrentContent()) })
  },



  render: function() {
    var info = []
    if (this.props.created_by_name) {
        info.push(<span><a href={"/wolontariusz/"+this.props.created_by}>{this.props.created_by_name}</a>, </span>)
    }

    var buttons = []
    if (this.props.is_admin) {
        if (!this.state.isEdited) {
             buttons.push(
              <button className="float--right" onClick={this.edit} style={{'marginTop': 10}}>
                Edytuj
              </button>
             )
        } else {
            buttons.push(
              <button className="float--right" onClick={this.save} style={{'marginTop': 10}}>
                Zapisz
              </button>
             )
            buttons.push(
              <button className="float--right" onClick={this.remove} style={{'marginTop': 10}}>
                Usuń
              </button>
             )
            buttons.push(
              <button className="float--right" onClick={this.cancel} style={{'marginTop': 10}}>
                Anuluj
              </button>
             )

        }

    }

    info.push(<span>{ moment(this.props.created_at).calendar() }</span>)
    return (
      <div className="activityUpdate">
        <hr />
        <p className="small italic">
            {info}
        </p>
        <Editor editorState={this.state.editorState} onChange={this.onChange} readOnly={!this.state.isEdited} />
        <p className="clearfix">
            {buttons}
        </p>
      </div>
    )
  }
})

var News = React.createClass({

  propTypes: {
    context: React.PropTypes.object
  },

  getInitialState: function () {
    var state = this.props.context.getStore(ActivityStore).getState()
    return state
  },

  _changeListener: function() {
    var state = this.props.context.getStore(ActivityStore)

    // Opis zadania
    var activityState = Draft.EditorState.push(this.state.activityState, Draft.ContentState.createFromBlockArray(state.activityState.getCurrentContent().getBlocksAsArray()))

    // Formularz nowej aktualizacji
    var newUpdateState = Draft.EditorState.push(this.state.newUpdateState, Draft.ContentState.createFromBlockArray(state.newUpdateState.getCurrentContent().getBlocksAsArray()))

    this.setState({
      activity: state.activity,
      volunteers: state.volunteers,
      activityState: activityState,
      newUpdateState: newUpdateState,
      updates: state.updates,
      updatesPage: state.updatesPage
    })
  },

  componentDidMount: function() {
    this.props.context.getStore(ActivityStore)
      .addChangeListener(this._changeListener)

    this.setState({
      mapReady: true
    })
  },

  componentWillUnmount: function() {
    this.props.context.getStore(ActivityStore)
      .removeChangeListener(this._changeListener)
  },

  update: function() {
    this.props.context.executeAction(actions.updateActivity, this.state.activity)
  },

  onAcceptButtonClick: function () {
    var user = this.user()
    var user_id = user && user.id
    this.props.context.executeAction(actions.joinActivity, {
      activity_id: this.state.activity.id,
      user_id: user_id
    })
  },

  onCancelButtonClick: function () {
    this.props.context.executeAction(actions.leaveActivity, {
      id: this.mine().id,
      body: {
        is_canceled: true
      }
    })
  },

  mine: function() {
    var user = this.user()
    var user_id = user && user.id
    if(!user_id) { return }
    return this.state.volunteers.find(function(volunteer) {
      return volunteer.user_id === user_id
    })
  },

  user: function() {
    return this.props.context.getUser()
  },

  onChange: function(editorState) {
    this.setState({
      newUpdateState: editorState
    })
  },

  onChange2: function(editorState) {
    this.setState({
      activityState: editorState
    })
  },

  handleNewUpdate: function() {
    var rawState = Draft.convertToRaw(this.state.newUpdateState.getCurrentContent())
    // Zignoruj jeżeli brak treści
    if(rawState.blocks.length === 1 && rawState.blocks[0].text === ''){
      return
    }

    var update ={
      raw: rawState,
      created_at: new Date(),
      created_by: this.user().id,
      created_by_name: this.user().first_name+" "+this.user().last_name
    }

    delete this.state.updates
    context.executeAction(actions.postNewsCreate, {
      id: this.state.activity.id,
      update: update,
      isToBeAdded: true,
      page: this.state.updatesPage,
      isNews: true
    })
  },

  handleUpdatesChange: function (index, update) {
    console.log('index ', index)
    var updates = this.state.updates || []
    updates[index].raw = update.raw || []

    delete this.state.updates
    if (update.toBeRemoved) {
        updates.splice(index,1)
        context.executeAction(actions.postNewsRemove, {
            id: this.state.activity.id,
            update: updates[index],
            index: index,
            isToBeRemoved: true,
            page: this.state.updatesPage,
            isNews: true
        })
    } else {
        var goToPreviousPage = (this.state.updatesPage > 1) && ( (this.state.activity.updates_size - 1) % NEWS_PER_PAGE == 0) 
        context.executeAction(actions.postNewsEdit, {
          id: this.state.activity.id,
          update: updates[index],
          index: index,
          page: this.state.updatesPage,
          goToPreviousPage: goToPreviousPage,
          isNews: true
        })
    }
  },

  //Paginacja
 /**/
  pagination: function () {
    var page = this.state.updatesPage
    var totalNews = (this.state.activity.updates_size) ? this.state.activity.updates_size : 0
    var pageCount = (totalNews > 0 ) ? Math.ceil(Number(totalNews/NEWS_PER_PAGE)) : 1
    
    var leftIcons
    var rightIcons
    if (page > 1) {
      leftIcons = <span>
                    <div className="news-pagination-leftIcons" onClick={this.handleFirstPage}>&#x276e;&#x276e;</div>
                    <div className="news-pagination-leftIcons" onClick={this.handlePreviousPage}>&#x276e;</div>
                  </span>
    }
    if (page < pageCount) {
      rightIcons = <span>
                    <div className="news-pagination-rightIcons" onClick={this.handleNextPage}>&#x276f;</div>
                    <div className="news-pagination-rightIcons" onClick={this.handleLastPage}>&#x276f;&#x276f;</div>
                  </span>
    }
 
    var content = <div className="news-pagination-content">Strona {page} z {pageCount}</div>
    
    return (
      <div>
        <br/>
        <span className="news-pagination">
          {leftIcons}
          {content}
          {rightIcons}
        </span>
      </div>
    )
  },
  
  
  handleFirstPage: function () {
    delete this.state.updates
    context.executeAction(navigateAction, {url: '/aktualnosci'})
  },
  
  handlePreviousPage: function () {
    var page = (Number(this.state.updatesPage)-1) > 0 ? (Number(this.state.updatesPage)-1) : 1
    delete this.state.updates
    context.executeAction(navigateAction, {url: '/aktualnosci;page='+page})
  },
  
  handleNextPage: function () {
    var page = (Number(this.state.updatesPage)+1)
    delete this.state.updates
    context.executeAction(navigateAction, {url: '/aktualnosci;page='+page})
  },
  
  handleLastPage: function () {
    var query = this.state.query
    var totalNews = (this.state.activity.updates_size) ? this.state.activity.updates_size : 0
    var pageCount = Math.ceil(Number(totalNews/NEWS_PER_PAGE))
    delete this.state.updates
    context.executeAction(navigateAction, {url: '/aktualnosci;page='+pageCount})
  },

  render: function () {

    var user = this.user()
    var is_admin = user && user.is_admin
    var activity = this.state.activity

    var updateForm
    if(this.user() && this.user().is_admin) {
      updateForm = (
        <div className="alert activity--updateBox">
          <p>
            Jako koordynator masz możliwość dodawania aktualizacji do
            które oprócz tego, że wyświetlą się na tej stronie
            będą wysłane drogą e-mailową do wszystkich wolontariuszy,
            którzy wyrazili na to zgodę.
          </p>
          <Editor editorState={this.state.newUpdateState} onChange={this.onChange} style={{'minHeight': 'initial'}}>
            <p className="clearfix">
              <button className="float--right" onClick={this.handleNewUpdate} style={{'marginTop': 10}}>
                Dodaj aktualizację
              </button>
            </p>
          </Editor>
        </div>
      )
    }

    var volunteers = this.state.volunteers
    var has_joined = !!this.mine()

    var button
    if (!has_joined && (volunteers.length < activity.limit || activity.limit==0)) { //acceptButton
      button = (<button className="button--xlg button--full" onClick={this.onAcceptButtonClick}><FormattedMessage id="news_accept" /></button>)
    } else if (has_joined) { // canceButton
      button = (<button className="button--xsm button--full bg--muted" onClick={this.onCancelButtonClick}><FormattedMessage id="news_cancel" /></button>)
    }

    var updates = this.state.updates || []

    var creator = activity.created_by || {}

    var handleUpdatesChange = this.handleUpdatesChange

   return (
        <div className="container">
          <div className="row">
            <div className="col col12">
              <div className="text--center activity-header">
                <h1>{this.state.activity.name}</h1>
              </div>

              {updateForm}

              {button}

              {updates.map(function(update, i) {
                return <NewsItem key={'update_'+activity.id+'_'+i} 
                    is_admin={is_admin} 
                    handleUpdatesChange={handleUpdatesChange}
                    index={i}
                    {...update} />
              })}

              {this.pagination()}
            </div>
           </div>
        </div>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = News
