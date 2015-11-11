var React = require('react')
var NavLink = require('fluxible-router').NavLink

var ActivityLi = React.createClass({
    render: function() {
        var id = "/aktywnosc/"+ this.props.id
        return (
            <li>
                <NavLink href={id}>
                    {this.props.name}
                </NavLink>
            </li>
        )
    }
})

var ActivitiesList = React.createClass({
    render: function() {
        var results = this.props.results
        return (
            <ul>
                {results.map(function(result) {
                    return <ActivityLi id={result.id} name={result.title} />
                })}
            </ul>
        )
    }
})

module.exports = ActivitiesList
