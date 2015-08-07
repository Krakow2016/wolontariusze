var React = require('react')

var VolonteerLi = React.createClass({
    render: function() {
        return (
            <li>
                {this.props.name}
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
                    return <VolonteerLi name={result.first_name} />
                })}
            </ul>
        )
    }
})

module.exports = VolonteerList
