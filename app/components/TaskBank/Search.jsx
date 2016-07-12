var React = require('react')

var Search = React.createClass({

  propTypes: {
    handleChange: React.PropTypes.func,
    query: React.PropTypes.object,
    submit:  React.PropTypes.func
  },

  render: function() {
    return (
      <div>
        <input
          type="hidden"
          name="created_by"
          onChange={this.props.handleChange}
          value={this.props.query.created_by} />
        <input
          type="hidden"
          name="volunteer"
          onChange={this.props.handleChange}
          value={this.props.query.volunteer} />
        <input
          type="hidden"
          name="act_type"
          onChange={this.props.handleChange}
          value={this.props.query.act_type} />
        <input
          type="hidden"
          name="priority"
          onChange={this.props.handleChange}
          value={this.props.query.priority} />
        <input
          type="hidden"
          name="placeDistance"
          onChange={this.props.handleChange}
          value={this.props.query.placeDistance} />
        <input
          type="hidden"
          name="placeLat"
          onChange={this.props.handleChange}
          value={this.props.query.placeLat} />
        <input
          type="hidden"
          name="placeLon"
          onChange={this.props.handleChange}
          value={this.props.query.placeLon} />
        <input
          type="hidden"
          name="tags"
          onChange={this.props.handleChange}
          value={this.props.query.tags} />
        <input
          type="hidden"
          name="timeState"
          onChange={this.props.handleChange}
          value={this.props.query.timeState} />
        <input
          type="hidden"
          name="availabilityState"
          onChange={this.props.handleChange}
          value={this.props.query.availabilityState} />
        <input
          type="hidden"
          name="page"
          onChange={this.props.handleChange}
          value={this.props.query.page} />
        <input type="hidden" value="Szukaj" onClick={this.props.submit} />
      </div>
    )
  }
})

module.exports = Search
