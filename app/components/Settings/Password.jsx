var React = require('react')
var MyTextField = require('./../Formsy/MyTextField.jsx')

var Password = React.createClass({
  render: function() {
    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1-3">
            <label htmlFor="password">Hasło</label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField required
              id="password"
              type="password"
              name="password"
              disabled={this.props.disabled}
              placeholder="Hasło"
              validations="minLength:6"
              validationError="Hasło składające się z minimum 6 znaków jest wymagane." />
          </div>

          <div className="pure-u-1 pure-u-md-1-3">
            <label htmlFor="password_">Powtórz hasło</label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField required
              id="password_"
              type="password"
              name="password_"
              disabled={this.props.disabled}
              placeholder="Powtórz hasło"
              validations="equalsField:password"
              validationError="Powtórzenie hasła jest wymagane." />
          </div>
        </div>
      </div>
    )
  }
})

module.exports = Password
