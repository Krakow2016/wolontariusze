var React = require('react')
var NavLink = require('fluxible-router').NavLink
var request = require('superagent')
var Formsy = require('formsy-react')

var moment = require('moment')

var update = require('react-addons-update')

var ActivityStore = require('../stores/Activity')
var ActivityVolonteersList = require('./ActivityVolonteersList.jsx')
var Tags = require('./Tags/Tags.jsx')


var MyDatetime = require('./Formsy/MyDatetime.jsx')
var MyTextField = require('./Formsy/MyTextField.jsx')
var Editor = require('./Editor.jsx')
var Draft = require('draft-js')

var actions = require('../actions')
var updateAction = actions.updateActivity
var leaveActivityAction = actions.leaveActivity
var createAction = actions.createActivity

Formsy.addValidationRule('isMoreOrGreaterIntThanZero', function (values, value) {
  return (value % 1 === 0 && value >= 0)
})


var AddedVolonteer = React.createClass({
  onClick: function () {
    this.props.onRemoveButtonClick(this.props.volunteer.id)
  },
  name: function() {
    var v = this.props.volunteer
    return v.display_name || (v.first_name +' '+ v.last_name)
  },
  render: function () {
    return (
        <div className="addedVolonteer" ><a href={'/wolontariusz/'+this.props.volunteer.user_id}>{this.name()}</a> <input type="button" className="addedVolonteerRemoveButton" onClick={this.onClick} value="Usuń"/></div>
    )
  }
})



var ActivityAdministration = React.createClass({

  propTypes: {
    context: React.PropTypes.object
  },

  getInitialState: function () {
    var state = this.props.context.getStore(ActivityStore).getState()
    // Tworzy kopię tablicy volontariuszy po to żeby później stwierdzić jakie
    // zaszły wn niej zmiany.
    state._volunteers = Object.assign({}, state).volunteers

    // Początkowa pozycja mapy (domyślnie Rynek Główny)
    state.init_position = state.activity.lat_lon || [50.061720, 19.937376]

    return state
  },

  _changeListener: function() {
    var state = this.props.context.getStore(ActivityStore)
    var editorState = Draft.EditorState.push(this.state.activityState, Draft.ContentState.createFromBlockArray(state.activityState.getCurrentContent().getBlocksAsArray()))

    this.setState({
      activity: state.activity,
      activityState: editorState,
      volunteers: state.volunteers,
    })
    state._volunteers = Object.assign({}, state).volunteers
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

  user: function() {
    return this.props.context.getUser()
  },

  handleDatetimeChange: function (m) {
    this.setState(update(this.state, {
      activity: {datetime: {$set: m}}
    }))
  },

  handleAddDatetimeChange: function(evt) {
    var value = evt.target.checked

    var activity = this.state.activity
    if (!value) {
      activity.datetime = null
    } else {
      activity.datetime = new Date()
    }

    this.setState(update(this.state, {
      activity: {$set: activity}
    }))
  },

  handleEndtimeChange: function (m) {
    this.setState(update(this.state, {
      activity: {endtime: {$set: m}}
    }))
  },

  handleAddEndtimeChange: function(evt) {
    var value = evt.target.checked

    var activity = this.state.activity
    if (!value) {
      activity.endtime = null
    } else {
      activity.endtime = new Date()
    }

    this.setState(update(this.state, {
      activity: {$set: activity}
    }))
  },


  handleChange: function (evt) {
    var activity = {}
    var target = evt.target != null
      ? evt.target
      : evt.currentTarget
    var value = target.type === 'checkbox'
      ? target.checked
      : target.value
    activity[target.name] = {$set: value}
    this.setState(update(this.state, {
      activity: activity
    }))
  },

  onChange: function(editorState) {
    this.setState({
      activityState: editorState
    })
  },

  handleAddPositionChange: function(evt) {
    var value = evt.target.checked
    this.setState(update(this.state, {
      activity: {
        lat_lon: {$set: value ? this.state.init_position : undefined}
      }
    }))
  },

  addActiveVolonteer: function (volunteer) {
    var joint = {
      activity_id: this.state.activity.id,
      user_id: volunteer.user_id,
      display_name: volunteer.display_name
    }

    this.setState(update(this.state, {
      volunteers: {$push: [joint]}
    }))
  },

  removeActiveVolonteer: function (id) {
    this.setState(update(this.state, {
      volunteers: {$apply: function(arr) {
        var index = arr.findIndex(function(volunteer){
          return volunteer.id === id
        })
        if(index > -1) { arr.splice(index, 1) }
        return arr
      }}
    }))
  },

  isValidDate: function (currentDate) {
    var now = moment()
    var isDateFromFuture = currentDate.isAfter(now)
    var taskMode = this.props.taskMode
    if (taskMode) {
      return true
      //Czy warto dawać walidację czasu, jeśli okaże się, że zadanie rozpocznie się w innym terminie
      //i koordynator będzie chciał zaktualizować?
    } else {
      return !isDateFromFuture
    }
  },

  onValidSubmit: function () {

    //if (this.state.volunteers.length > this.state.activity.limit) {
      //this.setState(update(this.state, {
        //invalidSnackBar: {$set: 'Ustaw większy limit wolontariuszy'}
      //}))
      //return
    //}

    if (this.props.creationMode == false) {
      this.update()
    } else {
      this.create()
    }
  },

  enableButton: function () {
    this.setState({
      canSubmit: true
    })
  },

  disableButton: function () {
    this.setState({
      canSubmit: false
    })
  },

  update: function () {
    var state = this.state
    var context = this.props.context

    var activity = Object.assign({}, this.state.activity, {
      description: Draft.convertToRaw(this.state.activityState.getCurrentContent())
    })

    // Aktualizuje parametry aktywności
    context.executeAction(updateAction, activity)

    // Usuwa wolontariuszy z aktywności
    var removed = state._volunteers.filter(function(i) {
      return state.volunteers.findIndex(function(el){
        return el.id === i.id
      }) < 0
    }).reduce(function(sum, joint) {
      return sum.concat([joint.id])
    }, [])

    if(removed.length) {
      var payload = {
        ids: removed,
        body: {
          is_canceled: true
        }
      }
      context.executeAction(leaveActivityAction, payload)
    }

    // Dodaje nowych wolontariuszy do aktywności
    var added = state.volunteers.filter(function(i) {
      return state._volunteers.findIndex(function(el){
        return el.id === i.id
      }) < 0
    })
    if(added.length) {
      context.executeAction(actions.assignActivity, added)
    }
  },

  create: function () {

    var activity = Object.assign({}, this.state.activity, {
      description: Draft.convertToRaw(this.state.activityState.getCurrentContent())
    })

    var payload = Object.assign({}, this.state, { activity: activity })

    this.props.context.executeAction(createAction, payload)
  },

  map: function() {
    if(!this.state.mapReady || !this.state.activity.lat_lon) {
      return (<div />)
    }

    var Leaflet = require('react-leaflet')
    var position = this.state.activity.lat_lon

    return (
      <Leaflet.Map center={this.state.init_position} zoom={15} scrollWheelZoom='center' onLeafletMove={this.handleMove}>
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

  handleMove: function(e) {
    var center = e.target.getCenter()
    this.setState(update(this.state, {
      activity: {lat_lon: {$set: [center.lat, center.lng]}}
    }))
  },

  findCoordinates: function() {
    var that = this

    request
      .get('https://nominatim.openstreetmap.org/search.php')
      .query({
        q: this.state.activity.place,
        format: 'json'
      })
      .end(function(err, resp) {
        var json = resp.body[0]
        var lat_lon = [parseFloat(json.lat), parseFloat(json.lon)]
        that.setState({
          init_position: lat_lon
        })
        that.setState(update(that.state, {
          activity: {
            lat_lon: {$set: lat_lon}
          }
        }))
      })
  },

  saveTag: function(tag) {
    this.state.activity.tags = this.state.activity.tags || []
    this.setState(update(this.state, {
      activity: {
        tags: {$push: [tag]}
      }
    }))
  },

  removeTag: function(e) {
    var tag = e.target.dataset.tag
    var index = this.state.activity.tags.indexOf(tag)
    this.setState(update(this.state, {
      activity: {
        tags: {$splice: [[index, 1]]}
      }
    }))
  },

  createPrivate: function() {
    this.setState(update(this.state, {
      activity: {is_private: {$set: true}}
    }))
  },

  render: function() {
    var dateTime
    if (this.state.activity.datetime) {
      var datetimeHint
      if (this.props.taskMode) {
        datetimeHint = <span> Dla zadania data powinna być w przyszłości </span>
      } else {
        datetimeHint = <span> Dla aktywności data powinna być w przeszłości </span>
      }
      var datetimeDate = new Date(this.state.activity.datetime)
      dateTime = <div className="pure-u-1 pure-u-md-2-3">
                    {datetimeHint}
                    <MyDatetime
                      id='datetime'
                      name='datetime'
                      value={datetimeDate}
                      validationError='Niepoprawny format daty'
                      handleChange={this.handleDatetimeChange}
                    />
                </div>
    }

    var endTime
    if (this.state.activity.endtime) {
      var endTimeDateHint = <span> Powinna być później niż czas zakońćzenia zgłoszeń do zadania </span>
      var endTimeDate = new Date(this.state.activity.endtime)
      endTime = <div className="pure-u-1 pure-u-md-2-3">
                    {endTimeDateHint}
                    <MyDatetime
                      id='endtime'
                      name='endtime'
                      value={endTimeDate}
                      validationError='Niepoprawny format daty'
                      handleChange={this.handleEndtimeChange}
                    />
                </div>
    }

    var updateButton = []
    if (this.props.creationMode == false) {
      updateButton = <input type="submit" value="Zapisz" disabled={!this.state.canSubmit} />
    }

    var createButton = []
    if (this.props.creationMode == true) {
      createButton = <button className={this.state.canSubmit ? 'bg--warning' : ''} disabled={!this.state.canSubmit} onClick={this.createPrivate}>Utwórz prywatne zadanie</button>
    }

    var createButton2 = []
    if (this.props.creationMode == true) {
      createButton2 = <input type="submit" value="Utwórz publiczne zadanie" disabled={!this.state.canSubmit} />
    }

    var showButton = []
    if (this.props.creationMode == false) {
      showButton = <NavLink href={'/zadania/'+this.state.activity.id} >Wyświetl</NavLink>
    }

    var removeActiveVolonteer = this.removeActiveVolonteer
    var addVolonteer
    if (!this.state.activity.limit || this.state.volunteers.length < this.state.activity.limit) {
      addVolonteer = <ActivityVolonteersList
            id="activeVolonteers"
            addActiveVolonteer={this.addActiveVolonteer}
            excludedVolunteers={this.state.volunteers} />
    }
    var volunteers = this.state.volunteers || []
    var volunteersList = volunteers.map(function(volunteer) {
      return (
        <AddedVolonteer
          key={volunteer.user_id}
          volunteer={volunteer}
          onRemoveButtonClick={removeActiveVolonteer} />
      )
    })

    var tags = this.state.activity.tags || []

    return (
      <div>
        <Formsy.Form
          ref="formsy"
          className="settingsForm"
          onValidSubmit={this.onValidSubmit}
          onValid={this.enableButton}
          onInvalid={this.disableButton} >

          <b>Tytuł</b>
          <MyTextField required
            id='name'
            name='name'
            placeholder=''
            validations='minLength:3'
            validationError='Tytuł jest wymagany'
            disabled={false}
            value={this.state.activity.name}
            onChange={this.handleChange} />

          <br/>
          <b>Treść </b>
          <br/>
          <Editor editorState={this.state.activityState} onChange={this.onChange} />
          <br/>
          <b>Kategorie:</b>
          <Tags data={tags} onSave={this.saveTag} onRemove={this.removeTag} />

          <b>Typ</b>
          <select name="act_type" selected={this.state.activity.act_type} onChange={this.handleChange}>
            <option value="niezdefiniowany">Niezdefiniowany</option>
            <option value="dalem_dla_sdm">Dałem dla ŚDM</option>
            <option value="wzialem_od_sdm">Wziąłęm od ŚDM</option>
          </select>
          <br/>
          <br/>
          <input id="datetime" type="checkbox" name="addDatetime" checked={ !!this.state.activity.datetime } onChange={this.handleAddDatetimeChange} />
          <label htmlFor="datetime">Czas zakończenia zgłoszeń do zadania</label>
          {dateTime}
          <br/>

          <input id="endtime" type="checkbox" name="addEndtime" checked={ !!this.state.activity.endtime } onChange={this.handleAddEndtimeChange} />
          <label htmlFor="endtime">Data zakończenia</label>
          {endTime}

          <br/>
          <div className="pure-u-1 pure-u-md-1-3">
            <b>Miejsce</b>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField
              id='place'
              name='place'
              placeholder=''
              validations='minLength:3'
              validationError='Miejsce jest wymagane'
              disabled={false}
              value={this.state.activity.place}
              onChange={this.handleChange} />

            <input type="button" value="Wyszukaj..." onClick={this.findCoordinates} disabled={this.state.activity.place === ''} />
          </div>

          <input id="position" type="checkbox" name="addPosition" checked={!!this.state.activity.lat_lon} onChange={this.handleAddPositionChange} />
          <label htmlFor="position">Współrzędne geograficzne</label>

          <br/>

          { this.map() }

          <input id="urgent" type="checkbox" name="is_urgent" checked={this.state.activity.is_urgent} onChange={this.handleChange} />
          <label htmlFor="urgent">Zadanie jest PILNE ?</label>
          <br/>

          <input id="is_archived" type="checkbox" name="is_archived" checked={this.state.activity.is_archived} onChange={this.handleChange} />
          <label htmlFor="is_archived">Zadanie jest w archiwum?</label>
          <br/>

          <b>Wolontariusze, którzy biorą udział:</b>
          <br/>
          {addVolonteer}
          <div>
            {volunteersList}
          </div>
          <br/>
          <div className="pure-u-1 pure-u-md-1-3">
            <b>Limit wolontariuszy</b>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField required
              id='limit'
              name='limit'
              placeholder=''
              validations='isMoreOrGreaterIntThanZero'
              validationError='Ustaw maksymalną liczbę wolontariuszy lub 0 (brak limitu)'
              disabled={false}
              value={this.state.activity.limit}
              onChange={this.handleChange} />
          </div>

          <br/>
          <br/>
          <br/>
          <div id="activityEditToolbar" className="text--center">
            {updateButton}
            {createButton}
            {createButton2}
            {showButton}
          </div>
          <br/>
        </Formsy.Form>


      </div>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = ActivityAdministration


          //<Snackbar
          //open={!!this.state.invalidSnackBar}
          //message={this.state.invalidSnackBar}
          //autoHideDuration={5000}
          //onRequestClose={this.handleInvalidSnackbarClose} />
