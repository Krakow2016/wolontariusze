var React = require('react')
var NavLink = require('fluxible-router').NavLink
var backdraft = require('backdraft-js')
var Draft = require('draft-js')

var Editor = require('./Editor.jsx')
var ProfilePic = require('./ProfilePic.jsx')
var ActivityStore = require('../stores/Activity')
var TimeService = require('../modules/time/TimeService.js')
var actions = require('../actions')

var Activity = React.createClass({

  getInitialState: function () {
    var state = this.props.context.getStore(ActivityStore).getState()
    return state
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(ActivityStore).getState())
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
      editorState: editorState
    })
  },

  handleNewUpdate: function() {

    var rawState = Draft.convertToRaw(this.state.editorState.getCurrentContent())
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
      editLink = <div className="adminToolbar">
        <NavLink href={'/zadania/'+ activity.id +'/edytuj'}>Edytuj</NavLink>
      </div>
    }

    var actType = function () {
      switch(activity.act_type) {
        case 'dalem_dla_sdm':
          return 'Dałem dla ŚDM'
        case 'wzialem_od_sdm':
          return 'Wziąłęm od ŚDM'
        default:
          return 'Niezdefiniowany'
      }
    }()
    
    var tags = this.state.activity.tags || []
    var tagsList = tags.map(function(tag) {
      return (
        <span className="activityTagLabel" key={tag}>{tag}</span>
      )
    })
    
    var startTime
    if (typeof (this.state.activity.datetime) != 'undefined')  {
      startTime = TimeService.showTime(activity.datetime) 
    } else {
      startTime = 'Nieokreślony'
    }
    
    var is_archived = (activity.is_archived) ? 'Tak' : 'Nie'
    
    var priority = (activity.is_urgent) ? 'PILNE' : 'NORMALNE'

    var volunteers = this.state.volunteers
    var has_joined = !!this.mine()

    var activeVolonteersList = volunteers.map(function(volunteer) {
      return (
        <span className="volonteerLabel" key={volunteer.id}>
          <NavLink href={'/wolontariusz/'+volunteer.user_id} className="tooltip--bottom" data-hint={volunteer.first_name +" "+ volunteer.last_name} >
            <ProfilePic src={volunteer.profile_picture_url} className='profileThumbnail' />
          </NavLink>
        </span>
      )
    })

    var buttons = []

    //acceptButton
    if (!has_joined && (volunteers.length < activity.limit || activity.limit==0)) {
      buttons.push(<input type="button" onClick={this.onAcceptButtonClick} value="Zgłaszam się" key="join" />)
    }

    //canceButton
    if (has_joined) {
      buttons.push(<input type="button" onClick={this.onCancelButtonClick} value="Wypisz mnie" key="leave" />)
    }

    var volonteersLimit = (activity.limit == 0) ? 'Brak' : activity.limit

    var raw = Draft.convertToRaw(activity.description.getCurrentContent())
    var html = backdraft(raw, {
      'BOLD': ['<strong>', '</strong>'],
      'ITALIC': ['<i>', '</i>'],
      'UNDERLINE': ['<u>', '</u>'],
      'CODE': ['<span style="font-family: monospace">', '</span>'],
    }).map(function(block) {
      return (<p dangerouslySetInnerHTML={{__html: block}} />)
    })

    var updateForm
    if(this.user() && this.user().is_admin) {
      updateForm = (
        <div className="alert alert--warning">
          <p>
            Jako administrator masz możliwość dodawania aktualiacji do
            zadania, które oprócz tego, że wyświetli się pod treścią
            zadania, będzie wysłane drogą e-mailową do wszystkich
            zgłoszonych do zadania wolontariuszy.
          </p>
          <Editor editorState={this.state.editorState} onChange={this.onChange} style={{'min-height': 'initial'}}>
            <p className="clearfix">
              <button className="bg--warning float--right" onClick={this.handleNewUpdate} style={{'margin-top': 10}}>
                Dodaj aktualizacje
              </button>
            </p>
          </Editor>
        </div>
      )
    }

    var updates = []
    if(this.state.activity.updates) {
      updates = this.state.activity.updates.map(function(update) {
        var html = backdraft(update.raw, {
          'BOLD': ['<strong>', '</strong>'],
          'ITALIC': ['<i>', '</i>'],
          'UNDERLINE': ['<u>', '</u>'],
          'CODE': ['<span style="font-family: monospace">', '</span>'],
        }).map(function(block) {
          return (<p dangerouslySetInnerHTML={{__html: block}} />)
        })
        return (
          <div className="activityUpdate">
            <hr />
            <p className="italic">
              Aktualizacja z dnia: {update.created_at.toString()}
            </p>
            {html}
          </div>
        )
      })
    }

    var warning = []
    if(this.state.activity.is_private === true) {
      warning = (
        <div className="alert alert--warning">
          <strong>Uwaga!</strong> Uważaj z kim się dzielisz tą stroną. Została ona oznaczona jako prywatna i jest widoczna tylko dla osób które otrzymały tajny link.
        </div>
      )
    }

    // TODO
    //<b>Dodano:</b> {TimeService.showTime(activity.creationTimestamp)} przez <span className="volonteerLabel"><a href={'/wolontariusz/'+activity.creator.id}>{activity.creator.name}</a></span>
    //<b>Ostatnia edycja:</b> {TimeService.showTime(activity.editionTimestamp)} przez <span className="volonteerLabel"><a href={'/wolontariusz/'+activity.editor.id}>{activity.editor.name}</a></span>
    return (
        <div ref={node => node && node.setAttribute('container', '')}>
          <div ref={node => node && node.setAttribute('row', '')}>
            <div ref={node => node && node.setAttribute('column', '7')}>

              {warning}

              {html}

              {updates}
              {updateForm}

            </div>
            <div ref={node => node && node.setAttribute('column', '5')}>
              <p className="text--center">
                <img src={activity.profile_picture_url} className="profileMedium" /><br />
                <span>
                  {activity.first_name} {activity.last_name}
                </span>
              </p>
              <b>Typ:</b> {actType}
              <br></br>
              <b>Kategorie:</b> {tagsList}
              <br></br>
              <b>Miejsce wydarzenia:</b> {activity.place}
              <br></br>
              <b>Czas rozpoczęcia:</b> {startTime}
              <br></br>
              <b>Czas trwania:</b> {activity.duration}
              <br></br>
              <b>Jest w archiwum?:</b> {is_archived}
              <br></br>
              <b>Prorytet:</b> {priority}
              <br></br>
              <b>Limit(maksymalna liczba wolontariuszy):</b> {volonteersLimit}
              <br></br>

              {buttons}

              {editLink}

          </div>
        </div>

        { this.map() }

        <b>Wolontariusze, którzy biorą udział:</b>
        <p>
          {activeVolonteersList}
        </p>
      </div>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = Activity
