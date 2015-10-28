var React = require('react')
var MyTextField = require('./MyTextarea.jsx')

var Info = React.createClass({
  render: function() {
    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1-3">
            <label htmlFor="first_name">Doświadczenie</label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField
              id="experience"
              name="experience"
              placeholder="Praktyki w ..."
              value={this.props.experience} />
          </div>
        </div>

        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1-3">
            <label htmlFor="first_name">Zainteresowania</label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField
              id="interests"
              name="interests"
              placeholder="Piłka nożna"
              value={this.props.interests} />
          </div>
        </div>

        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1-3">
            <label htmlFor="first_name">Gdzie chce się angażować</label>
          </div>
          <div className="pure-u-1 pure-u-md-2-3">
            <MyTextField
              id="departments"
              name="departments"
              placeholder="Sekcja tłumaczeń"
              value={this.props.departments} />
          </div>
        </div>
      </div>
    )
  }
})

module.exports = Info
