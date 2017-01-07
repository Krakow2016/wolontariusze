var React = require('react')
var update = require('react-addons-update')

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

var Comments = require('./Comments/Comments.jsx')

var UPDATES_HEIGHT = '50px'
var UPDATES_PER_PAGE = 5

var ActivityUpdate = React.createClass({

  getInitialState: function() {
    var map = this.props.raw.entityMap
    _.forEach(map, function(val, key) {
      val.data.mention = fromJS(val.data.mention)
    })

    var contentState = Draft.convertFromRaw(this.props.raw)
    var editorState = Draft.EditorState.createWithContent(contentState)

    return {
      editorState: editorState,
      isOpen: false
    }
  },

  onChange: function(editorState) {
    this.setState({
      editorState: editorState,
      isOpen: false
    })
  },

  toggleOpen: function () {
    var isOpen = !this.state.isOpen
    this.setState(update(this.state, {
      isOpen: { $set: isOpen }
    }))
  },

  render: function() {
    var buttons = []
    var editorStyle = {}
    var btnOpenStyle = {'marginTop': 10, 'backgroundColor': '#33697b' }
    btnOpenStyle['width'] = '100%';
    if (this.state.isOpen) {
      buttons.push(
        <button onClick={this.toggleOpen} style={btnOpenStyle}>
          <FormattedMessage id="news_close" />
        </button>
      )
    } else {
      buttons.push(
        <button onClick={this.toggleOpen} style={btnOpenStyle}>
          <FormattedMessage id="news_open" />
        </button>
      )
      editorStyle = { textOverflow: 'ellipsis', height: UPDATES_HEIGHT, overflow: 'hidden'}
    }
    return (
      <div className="activityUpdate">
        <hr />
        <p className="small italic">
          { moment(this.props.created_at).calendar() }
        </p>
        <Editor editorState={this.state.editorState} onChange={this.onChange} readOnly={true} style={editorStyle} />
        {buttons}
      </div>
    )
  }
})

var Activity = React.createClass({

  propTypes: {
    context: React.PropTypes.object
  },

  getInitialState: function () {
    var state = this.props.context.getStore(ActivityStore).getState()
    return state
  },

  _changeListener: function() {
    var state = this.props.context.getStore(ActivityStore).getState()

    // Opis zadania
    var activityState = Draft.EditorState.push(this.state.activityState, Draft.ContentState.createFromBlockArray(state.activityState.getCurrentContent().getBlocksAsArray()))

    // Formularz nowej aktualizacji
    var newUpdateState = Draft.EditorState.push(this.state.newUpdateState, Draft.ContentState.createFromBlockArray(state.newUpdateState.getCurrentContent().getBlocksAsArray()))
    console.log('CHANGE ACT STATE', state)
    this.setState({
      activity: state.activity,
      volunteers: state.volunteers,
      activityState: activityState,
      newUpdateState: newUpdateState,
      updates: state.updates,
      updatesPage: state.updatesPage,
      children: state.children
    })
  },

  componentDidMount: function() {
    this.props.context.getStore(ActivityStore)
      .addChangeListener(this._changeListener)

    this.setState({
      mapReady: true,
      updatesPage: 1
    })
  },

  componentWillUnmount: function() {
    this.props.context.getStore(ActivityStore)
      .removeChangeListener(this._changeListener)
  },

  map: function() {
    if(!this.state.mapReady || !this.state.activity.lat_lon) {
      return (<div />)
    }

    var Leaflet = require('react-leaflet')
    var position = this.state.activity.lat_lon

    return (
      <Leaflet.Map center={position} zoom={15}>
        <Leaflet.TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Leaflet.Marker position={position}>
          <Leaflet.Popup>
            <span>{this.state.activity.place}</span>
          </Leaflet.Popup>
        </Leaflet.Marker>
      </Leaflet.Map>
    )
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

    var updates = this.state.updates || []
    var newUpdate = {
      raw: rawState,
      created_at: new Date(),
      created_by: this.user().id
    }
    updates.unshift(newUpdate)

    var newPage = this.state.updatesPage
    if (updates.length > UPDATES_PER_PAGE * this.state.updatesPage) {
      newPage = newPage + 1
    }

    // Aktualizuje parametry aktywności
    context.executeAction(actions.postActivityUpdate, {
      id: this.state.activity.id,
      update: newUpdate,
      isToBeAdded: true,
      page: this.state.updatesPage,
      isNews: true
    })
  },

  moreUpdates: function () {
    var updatesPage = this.state.updatesPage+1
    
    context.executeAction(actions.moreActivityUpdates, {
      id: this.state.activity.id,
      page: updatesPage
    })


  },

  render: function () {

    var user = this.user()
    var is_admin = user && user.is_admin
    var activity = this.state.activity

    var editLink
    if(is_admin) {
      editLink = <div className="alert clearfix">
        <p>
          Jako koordynator masz prawo do edycji treści i parametrów zadań. <NavLink href={'/zadania/'+ activity.id +'/edytuj'}>Kliknij edytuj</NavLink> aby przejść do strony edycji.
        </p>
      </div>
    }

    var actType = function () {
      switch(activity.act_type) {
      case 'wzialem_od_sdm':
        return 'Wziąłęm od ŚDM'
      default:
        return 'Dałem dla ŚDM'
      }
    }()

    var tags = this.state.activity.tags || []
    var tagsList = tags.map(function(tag) {
      return (
        <span className="activityTagLabel" key={tag}>{tag}</span>
      )
    })

    var applicationTime
    if (this.state.activity.datetime)  {
      applicationTime = moment(activity.datetime).calendar()
    } else {
      applicationTime = 'Nieokreślony'
    }

    var endTime
    if (this.state.activity.endtime)  {
      endTime = moment(activity.endtime).calendar()
    } else {
      endTime = 'Nieokreślona'
    }

    var is_archived = (activity.is_archived) ? 'Tak' : 'Nie'

    var priority = (activity.is_urgent) ? (<span className="urgent">PILNE</span>) : (<span clssName="normal">NORMALNE</span>)

    var is_public = (activity.is_public) ? 'Tak' : 'Nie'

    var volunteers = this.state.volunteers
    var has_joined = !!this.mine()

    var activeVolonteersList 
    if (this.user()) {
      activeVolonteersList = volunteers.map(function(volunteer) {
        return (
          <span className="volonteerLabel" key={volunteer.id}>
            <NavLink href={'/wolontariusz/'+volunteer.user_id} className="tooltip--bottom" data-hint={volunteer.first_name +' '+ volunteer.last_name} >
              <ProfilePic src={volunteer.thumb_picture_url} className='profileThumbnail' />
            </NavLink>
          </span>
        )
      })
    }

    var button
    if (this.user() && !has_joined && (volunteers.length < activity.limit || activity.limit==0)) { //acceptButton
      button = (<button className="button--xlg button--full" onClick={this.onAcceptButtonClick}><FormattedMessage id="activity_volunteer" /></button>)
    } else if (this.user() && has_joined) { // canceButton
      button = (<button className="button--xsm button--full bg--muted" onClick={this.onCancelButtonClick}><FormattedMessage id="activity_volunteer_cancel" /></button>)
    }

    var volonteersLimit = (activity.limit == 0) ? 'Brak' : activity.limit

    var updateForm
    if(this.user() && this.user().is_admin) {
      updateForm = (
        <div className="alert activity--updateBox">
          <p>
            Jako koordynator masz możliwość dodawania aktualiacji do
            zadania, które oprócz tego, że wyświetli się pod treścią
            zadania, będzie wysłane drogą e-mailową do wszystkich
            zgłoszonych do zadania wolontariuszy.
          </p>
          <Editor editorState={this.state.newUpdateState} onChange={this.onChange} style={{'minHeight': 'initial'}}>
            <p className="clearfix">
              <button className="float--right" onClick={this.handleNewUpdate} style={{'marginTop': 10}}>
                Dodaj aktualizacje
              </button>
            </p>
          </Editor>
        </div>
      )
    }

    var updates = this.state.updates || []
    var warning = []
    if(this.state.activity.is_private === true) {
      warning = (
        <div className="alert alert--warning">
          <FormattedMessage id="activity_private_description" />
      </div>
      )
    }

    var isPublicInfo
    if(this.state.activity.is_public === true && !user) {
      isPublicInfo = (
        <div className="alert alert--warning">
          <strong><FormattedMessage id="activity_public_attention" /> </strong><FormattedMessage id="activity_public_description" /> <b>kontakt@goradobra.pl</b></div>
      )
    }

    var creator = activity.created_by || {}

    var addSubtask
    if(is_admin) {
      addSubtask = <div className="alert clearfix">
        <p>
          Jako koordynator masz prawo do tworzenia nowych podzadań. Kliknij <NavLink href={'/zadania/nowe/'+ activity.id }>dodaj podzadanie</NavLink> aby przejść do strony tworzenia.
        </p>
      </div>
    }
    var childrenActs = this.state.children || []
    var subtaskList = childrenActs.map(function (child) {


      var subtaskState
      var dateNow =  Date.now()
      if (child.is_archived || ( child.endtime && dateNow > new Date(child.endtime).getTime() ) ) {
        subtaskState = <span className="activity-subtask-state-nonfree">Zakończone</span>
      } else if (child.datetime && dateNow> new Date(child.datetime).getTime()) {
        subtaskState = <span className="activity-subtask-state-nonfree">Zakończenie zgłoszeń</span>
      //} else if (child.volunteers.length == child.activity.limit && child.activity.limit!=0)
      //   subtaskState = <span className="activity-subtask-state-nonfree">Zajęte</span>
      } else {
        subtaskState = <span className="activity-subtask-state-free">Trwa</span>
      }
      return (<div className="activity-subtask" >
          <span className="activity-subtask-name"><a href={'/zadania/'+child.id} >{child.name}</a></span>
          <span> {subtaskState} </span>
        </div>
      )
    })


    var subtasks = (<div>
        <br/>
        <b className="big-text"><FormattedMessage id="activity_subtasks_header" /> ({childrenActs.length}):</b>
        {addSubtask}
        {subtaskList}
      </div>
    )

    var parentTaskLink="Nie"
    if (this.state.activity.parent_id) {
      parentTaskLink=(<NavLink href={"/zadania/"+this.state.activity.parent_id}>Tak</NavLink>)
    }

    var moreUpdatesButton = []
    if (this.state.activity.updates_size > this.state.updatesPage * UPDATES_PER_PAGE ) {
        moreUpdatesButton = <div className="activity-updates-more" onClick={this.moreUpdates}>
          <b><FormattedMessage id="activity_updates_more" /></b>
        </div>
    }

    // TODO
    //<b>Dodano:</b> {TimeService.showTime(activity.creationTimestamp)} przez <span className="volonteerLabel"><a href={'/wolontariusz/'+activity.creator.id}>{activity.creator.name}</a></span>
    //<b>Ostatnia edycja:</b> {TimeService.showTime(activity.editionTimestamp)} przez <span className="volonteerLabel"><a href={'/wolontariusz/'+activity.editor.id}>{activity.editor.name}</a></span>
    return (
        <div className="container">
          <div className="row">

            {isPublicInfo}

            <div className="col col7">
              <div className="text--center activity-header">
                <h1>{this.state.activity.name}</h1>
              </div>

              {editLink}

              {warning}

              <Editor editorState={this.state.activityState} onChange={this.onChange2} readOnly={true} />

              <br/>
              <b className="big-text"><FormattedMessage id="activity_updates_header" /> ({this.state.activity.updates_size}):</b>
        
              {updates.map(function(update, i) {
                return <ActivityUpdate key={'update_'+activity.id+'_'+i} {...update} />
              })}

              <br/>
              {moreUpdatesButton}

              {updateForm}

            </div>
            <div className="col col5">

              <div className="text--center activity-image">
                <ProfilePic src={creator.profile_picture_url} />
              </div>
              <p className="activity-profile-name">
                <NavLink href={'/wolontariusz/'+ creator.id}>
                  {creator.first_name} {creator.last_name}
                </NavLink>
              </p>
              <p className="activity-profile-responsibilities ">
                {creator.responsibilities}
              </p>
              <table className="table--hoverRow activity-table">
                <tbody>
                  <tr>
                    <td scope="Typ">Typ</td>
                    <td>{actType}</td>
                  </tr>
                  <tr>
                    <td scope="Kategorie">Kategorie</td>
                    <td>{tagsList}</td>
                  </tr>
                  <tr>
                    <td scope="Miejsce">Miejsce</td>
                    <td>{activity.place}</td>
                  </tr>
                  <tr>
                    <td scope="Zakończenie">Zakończenie zgłoszeń</td>
                    <td>{applicationTime}</td>
                  </tr>
                  <tr>
                    <td scope="Czas">Zakończenia zadania</td>
                    <td>{endTime}</td>
                  </tr>
                  <tr>
                    <td scope="Archiwalne">Archiwalne</td>
                    <td>{is_archived}</td>
                  </tr>

                  <tr>
                    <td scope="Publiczne">Publiczne</td>
                    <td>{is_public}</td>
                  </tr>
                  <tr>
                    <td scope="Priorytet">Priorytet</td>
                    <td>{priority}</td>
                  </tr>
                  <tr>
                    <td scope="Limit osób">Limit osób</td>
                    <td>{volonteersLimit}</td>
                  </tr>
                  <tr>
                    <td scope="Jest podzadaniem">Jest podzadaniem</td>
                    <td>{parentTaskLink}</td>
                  </tr>
                </tbody>
              </table>

              {button}

              {subtasks}
          </div>
        </div>

        { this.map() }

        <b className="big-text"><FormattedMessage id="activity_volunteers_count" /> ({volunteers.length}):</b>
        <p>
          {activeVolonteersList}
        </p>

        <Comments context={this.props.context} />

      </div>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = Activity
