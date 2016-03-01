var React = require('react')
var update = require('react-addons-update')

var actions = require('../actions')
var SearchForm = require('./SearchForm.jsx')
var SearchResults = require('./SearchResults.jsx')
var ResultsStore = require('../stores/Results')

var Search = React.createClass({
  getInitialState: function() {
    return this.props.context.getStore(ResultsStore).dehydrate()
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
    this.setState(this.props.context.getStore(ResultsStore).dehydrate())
  },

  handleChange: function(event) {
    var query = this.state.query
    query[event.target.name] = event.target.value
    this.setState({
      query: query
    })
  },

  handleCheckboxChange: function(event) {
    var query = this.state.query
    query[event.target.name] = !query[event.target.name]
    this.setState({
      query: query
    })
  },

  search: function(){
    this.props.context.executeAction(actions.showResults, this.state.query)
  },

  render: function() {
    return (
      <div>
        <p>Uprawnienia dostępu do bazy wyszukiwarki masz jedynie jako koordynator. Korzystając z niej zobowiązujesz się do zachowania w tajemnicy i nie ujawniania osobom trzecim otrzymanych tu informacji i danych o charakterze poufnym, w tym danych osobowych.
Administratorem powyższych danych jest Archidiecezja Krakowska.
Potwierdź swoje uprawnienia. (button)</p>
        <SearchForm
          query={this.state.query}
          search={this.search}
          handleChange={this.handleChange}
          handleCheckboxChange={this.handleCheckboxChange} />
        <SearchResults results={this.state.all} />
      </div>
    )
  }
})

module.exports = Search
