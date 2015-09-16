var React = require('react')
var createVolonteer = require('../actions').createVolonteer

var Registration = React.createClass({

  handleSubmit: function(e) {
      e.preventDefault()
      this.props.context.executeAction(createVolonteer, this.state);
  },

  handleChange: function(e) {
      var state = {}
      state[e.target.name] = e.target.value
      this.setState(state)
  },

  getInitialState: function () {
      return {}
  },

  render: function () {
      return (
        <form className="pure-form pure-form-aligned" onSubmit={this.handleSubmit}>
          <fieldset>
            <div className="pure-control-group">
              <label htmlFor="first_name">Imię</label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="Faustyna"
                value={this.state.first_name}
                onChange={this.handleChange} />
            </div>

            <div className="pure-control-group">
              <label htmlFor="last_name">Nazwisko</label>
              <input
                id="last_name"
                name="last_name"
                placeholder="Kowalska"
                value={this.state.last_name}
                onChange={this.handleChange} />
            </div>

            <div className="pure-control-group">
              <label htmlFor="sex">Płeć</label>
              <span>
                <input
                  id="male"
                  type="radio"
                  name="sex"
                  value="male"
                  defaultChecked={this.state === 'male'}
                  onChange={this.handleChange} />

                <label htmlFor="male" style={{textAlign: "left"}}>
                  Mężczyzna
                </label>

                <input
                  id="female"
                  type="radio"
                  name="sex"
                  value="female"
                  defaultChecked={this.state === 'female'}
                  onChange={this.handleChange} />

                <label htmlFor="female" style={{textAlign: "left"}}>
                  Kobieta
                </label>
              </span>
            </div>

            <div className="pure-control-group">
              <label htmlFor="email">Adres e-mail</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="faustyna@kowalska.pl"
                value={this.state.email}
                onChange={this.handleChange} />
            </div>

            <div className="pure-controls">
              <label htmlFor="cb" className="pure-checkbox">
                <input id="cb" type="checkbox">
                  Zgadzam się na przetwarzanie danych osobowych
                </input>
              </label>
              <button type="submit" className="pure-button pure-button-primary">
                Wyślij
              </button>
            </div>
          </fieldset>
        </form>
      )
  }

})

module.exports = Registration
