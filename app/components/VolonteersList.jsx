var React = require('react')
var NavLink = require('fluxible-router').NavLink

var VolonteerLi = React.createClass({
  render: function() {
    var id = "/wolontariusz/"+ this.props.volonteer.id
    return (
      <li>
        <NavLink href={id}>
          {this.props.volonteer.first_name}
        </NavLink>
      </li>
    )
  }
})

var VolonteerList = React.createClass({
  render: function() {
    var results = this.props.results
    return (
      <ul>
        {results.map(function(result) {
          return <VolonteerLi key={result.id} volonteer={result} />
          })}
        </ul>
    )
  }
})

module.exports = VolonteerList
