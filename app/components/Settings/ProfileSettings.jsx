var React = require('react')
var update = require('react-addons-update')

var updateVolunteer = require('../../actions').updateVolunteer

var ProfileSettings = React.createClass({

  getInitialState: function () {
    return {
      canSubmit: false,
      profile_visible: this.props.profile_visible
    }
  },

  enableButton: function () {
    this.setState(update(this.state, {
      canSubmit: {$set: true}
    }))
  },

  disableButton: function () {
    this.setState(update(this.state, {
      canSubmit: {$set: false}
    }))
  },

  handleSubmit: function(data) {
    data.id = this.props.profileId
    this.props.context.executeAction(updateVolunteer, data)
  },
  
  handleProfileVisibleCheckboxChange: function (evt) {
    var value = evt.target.checked
    this.setState(update(this.state, {
      profile_visible: {$set: value}
    }))
    
    var data = {
      id: this.props.profileId,
      profile_visible: value
    }
    this.props.context.executeAction(updateVolunteer, data)
  },

  render: function() {
    var form_col = 'col col12'
    var form_class = 'settingsForm form-alert'
    var alert_col
    if(!this.props.state_formsy){
      form_col = 'col col7'
      form_class = 'settingsForm'
      alert_col = (
        <div className="col col5">
          <div className="alert">
            <p>
              Zachęcamy Cię do uzupełnienia go o dodatkowe informacje, które pozwolą Cię lepiej poznać.
              Profil będzie Twoją wizytówką. Będziesz mieć możliwość dzielenia się z innymi swoimi doświadczeniami i
              zaangażowaniem w ŚDM. Pokażesz ogrom wniesionego wkładu i efektów pracy, które będą
              tworzyć prawdziwą &quot;Górę Dobra&quot;. Zastanów się też nad tym, co chcesz opublikować, a które
              informacje wolisz zostawić dla siebie. <br/><br/>
              <b>Daj się poznać i zainspiruj innych! Uzupełnij swój profil już dziś!</b>
            </p>
          </div>
        </div>
      )
    }


    return (
      <div>
        <h1 className="header-text">
          Informacje publiczne
        </h1>
        <div className="row">
            <div className='col col5'>
              <p>
                <input id="profile_visible" type="checkbox" name="profile_visible" checked={!!this.state.profile_visible} onChange={this.handleProfileVisibleCheckboxChange} />
                <label htmlFor="profile_visible">Wyrażam zgodę na opublikowanie mojego profilu dla osób nie posiadających konta na portalu Góra Dobra</label>
              </p>
            </div>
            <div className='col col7'>
              <div className="alert">
              <p>
                Zaznaczenie tego pola wyboru oznacza, że zgadzasz się na to, aby Twój profil był widoczny także dla niezalogowanych użytkowników 
                lub osób nie posiadających konta na portalu Góra Dobra. W przypadku braku zaznaczenia opcji Twój profil będzie widoczny
                tylko dla zalogowanych wolontariuszy.
              </p>
              </div>
            </div>
          </div>
        <h1 className="header-text"></h1>
        <div className="container">
          <div className="row">
            <div className={form_col}>

              <Formsy.Form className={form_class} onSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>

                {this.props.children}

                <div className="btn-submit">
                  <button type="submit" className="button" disabled={!this.state.canSubmit}>
                    Zmień
                  </button>
                </div>
              </Formsy.Form>
            </div>
            {alert_col}
          </div>

        </div>
      </div>
    )
  }
})

module.exports = ProfileSettings

        //<Snackbar
          //open={!!this.props.success}
          //message="Zapisano"
          //autoHideDuration={5000}
          //onRequestClose={this.props.handleSuccessSnackbarClose} />
        //<Snackbar
          //open={!!this.props.error}
          //message="Wystąpił błąd"
          //autoHideDuration={5000}
          //onRequestClose={this.props.handleErrorSnackbarClose} />
