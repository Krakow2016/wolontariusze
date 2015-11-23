var React = require('react')
var NavLink = require('fluxible-router').NavLink

var actions = require('../actions')
var deleteAction = actions.deleteActivity


var ActivityLi = React.createClass({

    delete: function() {
        this.props.context.executeAction(deleteAction, {id: this.props.id});
    },
    render: function() {
        var id = "/aktywnosc/wyswietl/"+ this.props.id
        return (
            <li>
                <NavLink href={id}>
                    {this.props.name}
                </NavLink> 
                <input type="button" onClick={this.delete} value="Usuń"/>
            </li>
        )
    }
})

var ActivitiesList = React.createClass({
    render: function() {
        var results = this.props.results
        var context = this.props.context
        return (
            <ul>
                {results.map(function(result) {
                    return <ActivityLi id={result.id} name={result.title} context={context} />
                })}
            </ul>
        )
    }
})

module.exports = ActivitiesList
