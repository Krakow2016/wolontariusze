var React = require('react')
var ActivityStore = require('../stores/Activity')
var ActivityVolonteersList = require('./ActivityVolonteersList.jsx')

var Formsy = require('formsy-react')
var MyTextField = require('./Formsy/MyTextField.jsx')
var MyTextarea = require('./Formsy/MyTextarea.jsx')
var Snackbar = require('material-ui/lib/snackbar')
var DateTime = require('react-datetime')
var moment = require('moment')

var update = require('react-addons-update')

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
    return state
  },

  _changeListener: function() {
    // Interesują nas tylko zmiany w obiekcie activity. Aktualizacją obiektu
    // volunteers zajmujemy się sami.
    this.setState(this.props.context.getStore(ActivityStore).getState())
  },

  componentDidMount: function() {
    this.props.context.getStore(ActivityStore)
      .addChangeListener(this._changeListener)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(ActivityStore)
      .removeChangeListener(this._changeListener)
  },

  user: function() {
    return this.props.context.getUser()
  },

  handleStartEventTimestampChange: function (m) {
    this.setState(update(this.state, {
      activity: {datetime: {$set: m}}
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

  render: function() {
    var startEventDate = new Date(this.state.activity.datetime)
    var startEventDateHint
    if (this.props.taskMode) {
      startEventDateHint = <span> Dla zadania data powinna być w przyszłości </span>
    } else {
      startEventDateHint = <span> Dla aktywności data powinna być w przeszłości </span>
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
      showButton = <a href={'/aktywnosc/'+this.state.activity.id} ><input type="button" value="Wyświetl" /></a>
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
    var list = volunteers.map(function(volunteer) {
      return (
        <AddedVolonteer
          key={volunteer.user_id}
          volunteer={volunteer}
          onRemoveButtonClick={removeActiveVolonteer} />
      )
    })

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
              id='title'
              name='title'
              placeholder=''
              validations='minLength:3'
              validationError='Tytuł jest wymagany'
              disabled={false}
              value={this.state.activity.title}
              onChange={this.handleChange} />
          </div>


          <div className="pure-u-1 pure-u-md-1-3">
            <b>Czas rozpoczęcia</b>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
              <DateTime open={false}
                dateFormat={'YYYY/M/D'}
                timeFormat={'HH:mm'}
                isValidDate={this.isValidDate}
                value={startEventDate}
                onChange={this.handleStartEventTimestampChange}/>
              {startEventDateHint}
          </div>

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
          </div>

          <br></br>
          <b>Zadanie jest PILNE? </b>
          <br></br>
          <input type="checkbox" name="is_urgent" checked={this.state.activity.is_urgent} changeValue={this.handleChange} />
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
            {list}
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
