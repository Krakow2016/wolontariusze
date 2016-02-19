var React = require('react')
var AutoSuggest = require('react-autosuggest')

var ActivityVolonteersList = React.createClass ({

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
          field: 'suggest',
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
        var resp = request.responseText
        var json = JSON.parse(resp)

        var suggestions = json.suggest[0].options.map (function (option) {
          return {
            display_name: option.text,
            user_id: option.payload.id
          }
        }).filter(function (volunteer) {
          var excludedVolunteers = that.props.excludedVolunteers || []
          for (var i = 0; i < excludedVolunteers.length; i++) {
            if (volunteer.user_id == excludedVolunteers[i].user_id) {
              return false
            }
          }
          return true
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
      <span>{suggestion.display_name}</span>
    )
  },

  getSuggestionValue: function (suggestionObj) {
    return suggestionObj.display_name
  },

  onSuggestionSelected: function(evt, opts) {
    this.props.addActiveVolonteer(opts.suggestion)
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
        id={this.props.id}
        inputProps={{
          value: this.state.value,
          onChange: this.handleChange,
          className: this.props.className
        }}
        suggestions={this.state.suggestions}
        renderSuggestion={this.renderSuggestion}
        getSuggestionValue={this.getSuggestionValue}
        onSuggestionSelected={this.onSuggestionSelected} />
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = ActivityVolonteersList
