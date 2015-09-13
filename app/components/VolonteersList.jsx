var React = require('react')
var NavLink = require('fluxible-router').NavLink

var VolonteerLi = React.createClass({
    render: function() {
        var id = "/wolontariusz/"+ this.props.id
        return (
            <li>
                <NavLink href={id}>
                    {this.props.name}
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
                    return <VolonteerLi id={result.id} name={result.first_name} />
                })}
            </ul>
        )
    }
})

module.exports = VolonteerList
