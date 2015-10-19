var React = require('react')
var SearchForm = require('./SearchForm.jsx')
var SearchResults = require('./SearchResults.jsx')
var ResultsStore = require('../stores/Results')

var Search = React.createClass({
  getInitialState: function() {
    return {
      all: []
    }
  },

  componentDidMount: function componentDidMount() {
    // Nasłuchuj zmian w wynikach wyszukiwania
    this.props.context.getStore(ResultsStore)
      .addChangeListener(this._onStoreChange)
  },

  componentWillUnmount: function componentWillUnmount() {
    // Usuń funkcję nasłychującą
    this.props.context.getStore(ResultsStore)
      .removeChangeListener(this._onStoreChange)
  },

  _onStoreChange: function() {
     this.setState(this.props.context.getStore(ResultsStore).getState())
  },

  render: function() {
    return (
      <div>
        <SearchForm context={this.props.context} />
        <SearchResults results={this.state.all} />
      </div>
    )
  }
})

module.exports = Search
