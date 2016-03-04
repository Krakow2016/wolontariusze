var React = require('react')

var Search = React.createClass({

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

        <input type="hidden" value="Szukaj" onClick={this.props.submit} />
      </div>
    )
  }
})

module.exports = Search
