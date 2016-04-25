var React = require('react')

var updateVolunteer = require('../../actions').updateVolunteer

var ProfileSettings = React.createClass({

  getInitialState: function () {
    return {
      canSubmit: false
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

  handleSubmit: function(data) {
    data.id = this.props.profileId
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
              Profil będzie Twoją wizytówką. Informacje, które tutaj zamieścisz będą widoczne dla wszystkich
              odwiedzających portal. Będziesz mieć możliwość dzielenia się z innymi swoimi doświadczeniami i
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
