var React = require('react')
var ProfileImageChange = require('./ProfileImageChange.jsx')
var BasicForm = function(props) {
  return (
    <div ref={node => node && node.setAttribute('container', '')}>
      <div ref={node => node && node.setAttribute('row', '')}>
        <div ref={node => node && node.setAttribute('column', '7')}>

          <div className="alert">
            <p>
              Informacja o tym skąd pochodzą dane.
            </p>
          </div>

          <div className="pure-g">
            <div className="pure-u-1 pure-u-md-1-3">
              <label htmlFor="first_name">Imię</label>
            </div>
            <div className="pure-u-1 pure-u-md-2-3">
              <input required
                id="first_name"
                name="first_name"
                placeholder="Faustyna"
                validations="minLength:3"
                validationError="Imię jest wymagane"
                disabled={!!props.first_name}
                value={props.first_name} />
            </div>
          </div>

          <div className="pure-g">
            <div className="pure-u-1 pure-u-md-1-3">
              <label htmlFor="last_name">Nazwisko</label>
            </div>
            <div className="pure-u-1 pure-u-md-2-3">
              <input required
                id="last_name"
                name="last_name"
                placeholder="Kowalska"
                validations="minLength:3"
                validationError="Nazwisko jest wymagane"
                disabled={!!props.last_name}
                value={props.last_name} />
            </div>
          </div>

          <div className="pure-g">
            <div className="pure-u-1 pure-u-md-1-3">
              <label htmlFor="email">Adres e-mail</label>
            </div>
            <div className="pure-u-1 pure-u-md-2-3">
              <input required
                id="email"
                type="email"
                name="email"
                validations="isEmail"
                validationError="Adres email jest niepoprawny"
                placeholder="faustyna@kowalska.pl"
                disabled={!!props.last_name}
                value={props.email} />
            </div>
          </div>

        </div>
        <div ref={node => node && node.setAttribute('column', '5')}>

          <div className="pure-u-1 pure-u-md-1-3">
            <label>Twoje zdjęcie</label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <ProfileImageChange context={props.context} src={props.profile_picture_url} />
          </div>
        </div>
      </div>
    </div>
  )
}

module.exports = BasicForm
