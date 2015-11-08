var React = require('react')
var NavLink = require('fluxible-router').NavLink

var SearchResult = React.createClass({
  render: function() {
    return (
      <div>
        <NavLink href={"/wolontariusz/"+this.props.id}>
          {this.props.first_name} {this.props.last_name}
        </NavLink>
      </div>
    )
  }
})

var SearchResults = React.createClass({
  render: function() {

    var results = this.props.results.map(function(result) {
      return (<SearchResult {...result._source} key={result._id} />)
    })

    return (
      <div>
        <h2>Wyniki wyszukiwania:</h2>
        <div> {results} </div>
      </div>
    )
  }
})

module.exports = SearchResults
