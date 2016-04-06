var React = require('react')
var update = require('react-addons-update')

var actions = require('../actions')
var SearchForm = require('./SearchForm.jsx')
var SearchResults = require('./SearchResults.jsx')
var ResultsStore = require('../stores/Results')
var ApplicationStore = require('../stores/ApplicationStore')

var Search = React.createClass({
  getInitialState: function() {
    var state = this.props.context.getStore(ResultsStore).dehydrate()
    state.consent = this.props.context.getStore(ApplicationStore).consent
    return state
  },

  componentDidMount: function componentDidMount() {
    // Nasłuchuj zmian w wynikach wyszukiwania
    this.props.context.getStore(ResultsStore)
      .addChangeListener(this._onStoreChange)
    // Nasłuchuj zgody na warunki
    this.props.context.getStore(ApplicationStore)
      .addChangeListener(this._onConsent)
  },

  componentWillUnmount: function componentWillUnmount() {
    // Usuń funkcje nasłychujące
    this.props.context.getStore(ResultsStore)
      .removeChangeListener(this._onStoreChange)
    this.props.context.getStore(ApplicationStore)
      .removeChangeListener(this._onConsent)
  },

  _onStoreChange: function() {
    this.setState(this.props.context.getStore(ResultsStore).dehydrate())
  },

  _onConsent: function() {
    this.setState({
      consent: this.props.context.getStore(ApplicationStore).consent
    })
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
    var state = this.state.query
    this.props.context.executeAction(actions.showResults, state)

    var base = window.location.toString().replace(new RegExp('[?](.*)$'), '')
    var attributes = Object.keys(state).filter(function(key) {
      return state[key]
    }).map(function(key) {
      return key + '=' + state[key]
    }).join('&')

    history.replaceState({}, '', base +'?'+ attributes)
  },

  consent: function() {
    this.props.context.executeAction(actions.adminConsent)
  },

  render: function() {

    var consent = (
      <div className="alert alert--warning">
        <p>
          <strong>Uwaga:</strong> uprawnienia dostępu do bazy wyszukiwarki masz
          jedynie jako koordynator. Korzystając z niej zobowiązujesz się do
          zachowania w tajemnicy i nie ujawniania osobom trzecim otrzymanych tu
          informacji i danych o charakterze poufnym, w tym danych osobowych.
          Administratorem powyższych danych jest Archidiecezja Krakowska.
          Potwierdź swoje uprawnienia:
        </p>

        <p>
          <input type="button" className="button button--bordered border--warning" value="Potwierdzam, kontynuuj..." onClick={this.consent} />
        </p>
      </div>
    )

    var form = (
      <div>
        <SearchForm
          query={this.state.query}
          search={this.search}
          handleChange={this.handleChange}
          handleCheckboxChange={this.handleCheckboxChange} />
        <SearchResults results={this.state.all} />
      </div>
    )

    return this.state.consent ? form : consent
  }
})

module.exports = Search
