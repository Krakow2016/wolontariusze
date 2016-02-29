var React = require('react')
var NavLink = require('fluxible-router').NavLink
var request = require('superagent')
var Formsy = require('formsy-react')

var Snackbar = require('material-ui/lib/snackbar')
var DateTime = require('react-datetime')
var moment = require('moment')

var update = require('react-addons-update')

var ActivityStore = require('../stores/Activity')
var ActivityVolonteersList = require('./ActivityVolonteersList.jsx')
var Tags = require('./Tags/Tags.jsx')

var MyTextField = require('./Formsy/MyTextField.jsx')
var MyTextarea = require('./Formsy/MyTextarea.jsx')

var actions = require('../actions')
var updateAction = actions.updateActivity
var leaveActivityAction = actions.leaveActivity
var createAction = actions.createActivity
var deleteAction = actions.deleteActivity

//Formsy
Formsy.addValidationRule('isDuration', function (values, value) {
  if (value == '') {
    return true
  } else {
    var min = value.match(new RegExp ('([0-9]+m){1}', 'g'))
    var hours = value.match(new RegExp ('([0-9]+h){1}', 'g'))
    var days = value.match(new RegExp ('([0-9]+d){1}', 'g'))
    var other = value.match(new RegExp ('[^0-9mhd\u00a0\u0020]+', 'g'))
    return (
      (!!days || !!hours || !!min) && !other
    )
  }

})
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
    // Interesują nas tylko zmiany w obiekcie activity. Aktualizacją obiektu
    // volunteers zajmujemy się sami.
    //this.setState(this.props.context.getStore(ActivityStore).getState())
    this.setState(update(this.state, {
      activity: {$set: this.props.context.getStore(ActivityStore).getState().activity}
    }))
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
      delete activity.datetime
    } else {
      activity.datetime = new Date().getTime()
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

    if (this.state.volunteers.length > this.state.activity.maxVolunteers) {
      this.setState(update(this.state, {
        invalidSnackBar: {$set: 'Ustaw większy limit wolontariuszy'}
      }))
      return
    }

    if (this.props.creationMode == false) {
      this.update()
    } else {
      this.create()
    }
  },

  onInvalidSubmit: function () {
    this.setState(update(this.state, {
      invalidSnackBar: {$set: 'Potrzeba wypełnić Tytuł, Czas Rozpoczęcia, Limit Wolontariuszy'}
    }))
  },

  handleInvalidSnackbarClose: function () {
    this.setState(update(this.state, {
      invalidSnackBar: {$set: ''}
    }))
  },

  update: function () {
    var state = this.state
    var context = this.props.context
      // Aktualizuje parametry aktywności
    context.executeAction(updateAction, state.activity)

      // Usuwa wolontariuszy z aktywności
    var removed = state._volunteers.filter(function(i) {
      return state.volunteers.indexOf(i) < 0
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
      return state._volunteers.indexOf(i) < 0
    })
    if(added.length) {
      context.executeAction(actions.assignActivity, added)
    }
  },

  create: function () {
    /*Dla testów
    this.state.volunteers = [ {user_id: '1'}, {user_id: '2'}]
    */
    this.props.context.executeAction(createAction, this.state)
  },

  remove: function () {
    this.props.context.executeAction(deleteAction, {id: this.state.activity.id})
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
      .get('http://nominatim.openstreetmap.org/search.php')
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

  render: function() {
    var startTime
    if (typeof (this.state.activity.datetime) != 'undefined')  {
      var startEventDate = new Date(this.state.activity.datetime)
      var startEventDateHint
      if (this.props.taskMode) {
        startEventDateHint = <span> Dla zadania data powinna być w przyszłości </span>
      } else {
        startEventDateHint = <span> Dla aktywności data powinna być w przeszłości </span>
      }
      
      startTime = <div className="pure-u-1 pure-u-md-2-3">
                    <DateTime open={false}
                      dateFormat={'YYYY/M/D'}
                      timeFormat={'HH:mm'}
                      isValidDate={this.isValidDate}
                      value={startEventDate}
                      onChange={this.handleDatetimeChange}/>
                    {startEventDateHint}
                </div>
      
    }
    
   


    var updateButton = []
    if (this.props.creationMode == false) {
      updateButton = <input type="submit" value="Zapisz" />
    }

    var createButton = []
    if (this.props.creationMode == true) {
      createButton = <input type="submit" value="Utwórz" />
    }

    var removeButton = []
    if (this.props.creationMode == false) {
      removeButton = <input type="button" onClick={this.remove} value="Usuń" />
    }

    var showButton = []
    if (this.props.creationMode == false) {
      showButton = <NavLink href={'/zadania/'+this.state.activity.id} >Wyświetl</NavLink>
    }

    var removeActiveVolonteer = this.removeActiveVolonteer
    var addVolonteer
    if (this.state.volunteers.length < this.state.activity.maxVolunteers) {
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
        <Formsy.Form className="settingsForm"
                     onValidSubmit={this.onValidSubmit}
                     onInvalidSubmit={this.onInvalidSubmit}>

          <div className="pure-u-1 pure-u-md-1-3">
            <b>Tytuł</b>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField required
              id='name'
              name='name'
              placeholder=''
              validations='minLength:3'
              validationError='Tytuł jest wymagany'
              disabled={false}
              value={this.state.activity.name}
              onChange={this.handleChange} />
          </div>
          
          <div className="pure-u-1 pure-u-md-1-3">
            <b>Typ</b>
          </div>
          <div>
            <select name="type" selected={this.state.activity.type} onChange={this.handleChange}>
              <option value="dalem_dla_sdm">Niezdefiniowany</option>
              <option value="dalem_dla_sdm">Dałem dla ŚDM</option>
              <option value="wzialem_od_sdm">Wziąłęm od ŚDM</option>
            </select>
          </div>

          <br></br>
          <b>Kategorie:</b>

          <Tags data={tags} onSave={this.saveTag} onRemove={this.removeTag} />

          <div className="pure-u-1 pure-u-md-1-3">
            <b>Czas rozpoczęcia</b>
            <br></br>
            <input type="checkbox" name="addDatetime" checked={!!this.state.activity.datetime} onChange={this.handleAddDatetimeChange} />
          </div>
          {startTime}

          <br></br>
          <b>Zadanie jest w archiwum? </b>
          <br></br>
          <input type="checkbox" name="is_archived" checked={this.state.activity.is_archived} onChange={this.handleChange} />
          <br></br>

          <br></br>
          <br></br>
          <div className="pure-u-1 pure-u-md-1-3">
            <b>Czas trwania</b>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField
              id='duration'
              name='duration'
              placeholder=''
              validations='isDuration'
              validationError='Format to np. pusty string, "1d 3h 30m", "15m"'
              disabled={false}
              value={this.state.activity.duration}
              onChange={this.handleChange} />
          </div>

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
          <br></br>
            <br></br>
            <b>Współrzędne geograficzne:  </b>
            <br></br>
            <input type="checkbox" name="addPosition" checked={!!this.state.activity.lat_lon} onChange={this.handleAddPositionChange} />
            { this.map() }
          <br></br>
          

          <br></br>
          <b>Zadanie jest PILNE? </b>
          <br></br>
          <input type="checkbox" name="is_urgent" checked={this.state.activity.is_urgent} onChange={this.handleChange} />
          <br></br>

          <br></br>
          <b>Treść </b>
          <br></br>

          <MyTextarea id="activityContentTextarea" name="description" placeholder="Dodaj treść wiadomości" value={this.state.activity.description} onChange={this.handleChange} />
          <br></br>

          <b>Wolontariusze, którzy biorą udział:</b>
          <br></br>
          {addVolonteer}
          <div>
            {volunteersList}
          </div>
          <br></br>
          <div className="pure-u-1 pure-u-md-1-3">
            <b>Limit wolontariuszy</b>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField required
              id='maxVolunteers'
              name='maxVolunteers'
              placeholder=''
              validations='isMoreOrGreaterIntThanZero'
              validationError='Ustaw maksymalną liczbę wolontariuszy lub 0 (brak limitu)'
              disabled={false}
              value={this.state.activity.maxVolunteers}
              onChange={this.handleChange} />
          </div>

          <br></br>
          <br></br>
          <br></br>
          <div id="activityEditToolbar">
            <a href="https://guides.github.com/features/mastering-markdown/">
                <input type="button" value="Markdown" />
            </a>
            {removeButton}
            {updateButton}
            {createButton}
            {showButton}
          </div>
          <br></br>
        </Formsy.Form>


          <Snackbar
          open={!!this.state.invalidSnackBar}
          message={this.state.invalidSnackBar}
          autoHideDuration={5000}
          onRequestClose={this.handleInvalidSnackbarClose} />
      </div>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = ActivityAdministration
