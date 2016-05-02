var React = require('react')
var NavLink = require('fluxible-router').NavLink

var VolunteerLi = React.createClass({

  propTypes: {
    volunteer: React.PropTypes.object
  },

  render: function() {
    var id = '/wolontariusz/'+ this.props.volunteer.id
    return (
      <li>
        <NavLink href={id}>
          {this.props.volunteer.first_name}
        </NavLink>
      </li>
    )
  }
})

var VolunteerList = React.createClass({

  propTypes: {
    results: React.PropTypes.object
  },

  render: function() {
    var results = this.props.results
    return (
      <ul>
        {results.map(function(result) {
          return <VolunteerLi key={result.id} volunteer={result} />
        })}
      </ul>
    )
  }
})

module.exports = VolunteerList
