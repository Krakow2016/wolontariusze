var React = require('react')
var AutoSuggest = require('react-autosuggest');
var config = require('../../config.json')

var AutoSuggestVolonteer = React.createClass ({

  getInitialState: function () {
    return {
      value: '',
      suggestions: []
    }
  },

  getSuggestions: function() {
    var query = {
      suggest: {
        text: this.state.value,
        completion: {
            field: "suggest",
            fuzzy: {
                fuzziness: 1
            }
        }
      }
    }

    var that = this
    var request = new XMLHttpRequest()
    request.open('POST', '/suggest', true)
    request.setRequestHeader('Content-Type', 'application/json')
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var resp = request.responseText;
        var json = JSON.parse(resp)

        var suggestions = json.suggest[0].options.map (function (option) {
          return {
            id: option.payload.id,
            name: option.text
          };
        })

        that.setState({
          suggestions: suggestions
        })
      } else {
        // We reached our target server, but it returned an error
      }
    }

    request.onerror = function() {
      // There was a connection error of some sort
    }

    request.send(JSON.stringify(query))
  },

  renderSuggestion: function (suggestion, input) {
    return (
      <span>{suggestion.name}</span>
    )
  },

  getSuggestionValue: function (suggestionObj) {
    return suggestionObj.name
  },

  onSuggestionSelected: function(evt, opts) {
    this.props.addActiveVolonteer(opts.suggestion.id)
    this.setState({value: ''})
  },

  handleChange: function (evt, opts) {
    this.setState({
      value: evt.target.value || ''
    })

    // Zapobiega wywołaniu po zmianie wartości pola przez kliknięcie
    // podpowiedzi.
    if (opts.method === 'type') {
      this.getSuggestions()
    }
  },

  render: function () {
    return (
      <AutoSuggest
        id="activeVolonteers"
        inputProps={{
          value: this.state.value,
          onChange: this.handleChange
        }}
        suggestions={this.state.suggestions}
        renderSuggestion={this.renderSuggestion}
        getSuggestionValue={this.getSuggestionValue}
        onSuggestionSelected={this.onSuggestionSelected} />
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = AutoSuggestVolonteer
