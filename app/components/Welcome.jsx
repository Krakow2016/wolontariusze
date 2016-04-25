var React = require('react')
var NavLink = require('fluxible-router').NavLink
var navigateAction = require('fluxible-router').navigateAction
var Formsy = require('formsy-react')

var Password = require('./Settings/Password.jsx')
var MyCheckbox = require('./Formsy/MyCheckbox.jsx')
var updateVolunteer = require('../actions').updateVolunteer
var VolunteerStore = require('../stores/Volunteer')
var Disclamer = require('./Settings/Disclamer.jsx')

var Welcome = React.createClass({

  propTypes: {
    context: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      profile: this.props.context.getStore(VolunteerStore).getState().profile,
      canSubmit: false
    }
  },

  _changeListener: function() {
    if(this.props.context.getStore(VolunteerStore).getState().success) {
      // Hasło zostało zmienione
      this.props.context.executeAction(navigateAction, {
        type: 'replacestate',
        url: '/ustawienia'
      })
    }
  },

  componentDidMount: function() {
    this.props.context.getStore(VolunteerStore).addChangeListener(this._changeListener)
  },

  componentWillUnmount: function componentWillUnmount() {
    // Usuń funkcję nasłychującą
    this.props.context.getStore(VolunteerStore)
      .removeChangeListener(this._changeListener)
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

  handleSubmit: function(data) {
    data.id = this.state.profile.id
    this.props.context.executeAction(updateVolunteer, data)
  },

  render: function() {
    return (
      <div>
        <Formsy.Form className="settingsForm" onSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>
          <h2> Witaj! </h2>
          <Disclamer />

          <hr />
          <h4>
            By dokończyć rejestrację, wprowadź  hasło, którego będziesz
            używać za każdym razem logując się do swojego profilu.
          </h4>
          <div className="alert">

            <Password />

            <div>
              <MyCheckbox required="isFalse"
                id="cb1"
                name="cb1" value={false} />
              <label htmlFor="cb1">
                Regulamin serwisu Góra Dobra <NavLink href="/regulamin">(kliknij tutaj aby przeczytać)</NavLink>
              </label>

            </div>

            <div>
              <MyCheckbox required="isFalse"
                id="cb2"
                name="cb2" value={false} />

              <label htmlFor="cb2">
                Oświadczenie o wyrażeniu zgody na wykorzystanie wizerunku
              </label>

              <p>
                „Zgodnie z zapisami Ustawy o prawie autorskim i prawach pokrewnych z dnia 4
                lutego 1994 roku (Dz. U. z 2006 r., Nr 90, poz. 631 z późn. zm.) oświadczam, że
                wyrażam zgodę na nieodpłatne utrwalenie, wykorzystanie i powielanie zdjęć oraz
                nagrań video z moim wizerunkiem wyłącznie w celu promowania Światowych Dni
                Młodzieży 2016 w Krakowie oraz umieszczeniem ich na stronach internetowych oraz
                materiałach promujących Światowe Dni Młodzieży 2016 w Krakowie.”
              </p>

            </div>
            <div>
              <MyCheckbox required="isFalse"
                id="cb3"
                name="cb3" value={false} />

              <label htmlFor="cb3">
                Oświadczenie o przetwarzaniu danych osobowych
              </label>

              <p>
                "Wyrażam zgodę na  przetwarzanie zamieszczonych danych osobowych przez
                Papieską Radę ds.  Świeckich i przez Archidiecezję Krakowską wyłącznie dla
                celów organizacyjnych Światowych Dni Młodzieży. Dane zostaną przesłane w razie
                potrzeby tylko tym przedsiębiorstwom i instytucjom, które w imieniu wyżej
                wymienionych jednostek będą zaangażowane w organizację Światowych Dni
                Młodzieży. Jednocześnie oświadczam, iż  zostałem poinformowany, że:
                administratorem danych jest Papieska Rada ds. Świeckich z siedzibą - Piazza San
                Calisto 16, 00153 Roma, która w Polsce przekaże dane do Archidiecezji
                Krakowskiej z siedzibą w Krakowie, 31-004, ul. Franciszkańska 3; przekazanie
                wyżej wskazanych danych jest dobrowolne; przysługuje mi prawo dostępu do swoich
                danych oraz ich poprawiania.".
              </p>
            </div>

            <button type="submit" className="pure-button pure-button-primary" disabled={!this.state.canSubmit}>
              Zmień
            </button>
          </div>
        </Formsy.Form>
      </div>
    )
  }
})

module.exports = Welcome
