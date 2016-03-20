var React = require('react')
var Autosuggest = require('react-autosuggest')
var request = require('superagent')

var NewTag = React.createClass({

  getInitialState: function () {
    return {
      value: '',
      suggestions: []
    }
  },

  getSuggestions: function (value) {
    var inputValue = value.trim().toLowerCase();
    var inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.suggestions.filter(function(lang) {
      return lang.name.toLowerCase().slice(0, inputLength) === inputValue
    })
  },

  onChange: function(evt, opts) {
    this.setState({
      value: opts.newValue
    })
  },

  getSuggestionValue: function(suggestion) {
    return suggestion.name
  },

  renderSuggestion: function(suggestion) {
    return (
      <span>{suggestion.name}</span>
    )
  },

  handleSave: function(evt, opts) {
    this.props.onSave(opts.suggestionValue || this.state.value)
    this.setState({value: ''})
  },

  onSuggestionsUpdateRequested: function(opts) {
    this.setState({
      suggestions: this.getSuggestions(opts.value)
    })
  },

  componentDidMount: function() {
    var that = this
    request
      .get('/tags')
      .end(function(err, resp){
          that.suggestions = resp.body ? resp.body.map(function(tag) {
            return { name: tag }
          }) : []
      })
  },

  render: function() {

    var inputProps = {
      placeholder: 'Dodaj projekt...',
      value: this.state.value,
      onChange: this.onChange,
      className: 'input-category-add'
    }

    return (
      <div className="category-add">
        <Autosuggest
          suggestions={this.state.suggestions}
          onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
          renderSuggestion={this.renderSuggestion}
          getSuggestionValue={this.getSuggestionValue}
          onSuggestionSelected={this.handleSave}
          inputProps={inputProps} />
        <div className="btn-category-add">
          <button className="bg--primary" onClick={this.handleSave}>Dodaj</button>
        </div>
      </div>
    )
  }
})

module.exports = NewTag
