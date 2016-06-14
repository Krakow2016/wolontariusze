var React = require('react')
var NavLink = require('fluxible-router').NavLink
var Draft = require('draft-js')
var fromJS = require('immutable').fromJS
var _ = require('lodash')
var moment = require('moment')

var Editor = require('./Editor.jsx')
var ProfilePic = require('./ProfilePic.jsx')
var ActivityStore = require('../stores/Activity')
var actions = require('../actions')

var ActivityUpdate = React.createClass({

  getInitialState: function() {
    var map = this.props.raw.entityMap
    _.forEach(map, function(val, key) {
      val.data.mention = fromJS(val.data.mention)
    })

    var contentState = Draft.convertFromRaw(this.props.raw)
    var editorState = Draft.EditorState.createWithContent(contentState)

    return {
      editorState: editorState
    }
  },

  onChange: function(editorState) {
    this.setState({
      editorState: editorState
    })
  },

  render: function() {
    return (
      <div className="activityUpdate">
        <hr />
        <p className="small italic">
          { moment(this.props.created_at).calendar() }
        </p>
        <Editor editorState={this.state.editorState} onChange={this.onChange} readOnly={true} />
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
      updates: state.updates
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

    var updates = this.state.activity.updates || []
    updates.push({
      raw: rawState,
      created_at: new Date(),
      created_by: this.user().id
    })

    // Aktualizuje parametry aktywności
    context.executeAction(actions.postActivityUpdate, {
      id: this.state.activity.id,
      updates: updates
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

    var volunteers = this.state.volunteers
    var has_joined = !!this.mine()

    var activeVolonteersList = volunteers.map(function(volunteer) {
      return (
        <span className="volonteerLabel" key={volunteer.id}>
          <NavLink href={'/wolontariusz/'+volunteer.user_id} className="tooltip--bottom" data-hint={volunteer.first_name +' '+ volunteer.last_name} >
            <ProfilePic src={volunteer.thumb_picture_url} className='profileThumbnail' />
          </NavLink>
        </span>
      )
    })

    var button
    if (!has_joined && (volunteers.length < activity.limit || activity.limit==0)) { //acceptButton
      button = (<button className="button--xlg button--full" onClick={this.onAcceptButtonClick}>Zgłaszam się!</button>)
    } else if (has_joined) { // canceButton
      button = (<button className="button--xsm button--full bg--muted" onClick={this.onCancelButtonClick}>Wypisz mnie</button>)
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
          <strong>Uwaga!</strong> Uważaj z kim się dzielisz tą stroną. Została ona oznaczona jako prywatna i jest widoczna tylko dla osób które otrzymały tajny link.
        </div>
      )
    }

    var creator = activity.created_by || {}

    // TODO
    //<b>Dodano:</b> {TimeService.showTime(activity.creationTimestamp)} przez <span className="volonteerLabel"><a href={'/wolontariusz/'+activity.creator.id}>{activity.creator.name}</a></span>
    //<b>Ostatnia edycja:</b> {TimeService.showTime(activity.editionTimestamp)} przez <span className="volonteerLabel"><a href={'/wolontariusz/'+activity.editor.id}>{activity.editor.name}</a></span>
    return (
        <div className="container">
          <div className="row">
            <div className="col col7">
              <div className="text--center activity-header">
                <h1>{this.state.activity.name}</h1>
              </div>

              {editLink}

              {warning}

              <Editor editorState={this.state.activityState} onChange={this.onChange2} readOnly={true} />

              {updates.map(function(update, i) {
                return <ActivityUpdate key={'update_'+activity.id+'_'+i} {...update} />
              })}

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
                    <td scope="Priorytet">Priorytet</td>
                    <td>{priority}</td>
                  </tr>
                  <tr>
                    <td scope="Limit osób">Limit osób</td>
                    <td>{volonteersLimit}</td>
                  </tr>
                </tbody>
              </table>

              {button}
          </div>
        </div>

        { this.map() }

        <b className="big-text">Wolontariusze, którzy biorą udział ({volunteers.length}):</b>
        <p>
          {activeVolonteersList}
        </p>
      </div>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = Activity
