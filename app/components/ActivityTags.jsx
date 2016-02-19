var React = require('react')
var AutoSuggest = require('react-autosuggest')
var update = require('react-addons-update')

var actions = require('../actions')

var ActivityTags = React.createClass ({

  getInitialState: function () {
    return {
      value: '',
      suggestions: [],
      type: 'dodaj',
      removeSuggestion: {},
      showRemoveButton: false
    }
  },

  handleTypeChange: function (evt) {
    var value = evt.target.value
    this.setState(update(this.state, {
      value: {$set: ''},
      type: {$set: value},
      removeSuggestion: {$set: {}},
      showRemoveButton: {$set: false}
    }))
  },
  
  onCreateTagButtonClick: function () {
    this.props.context.executeAction(actions.createActivityTag, {
      name: this.state.value,
      name_suffix: ''
    })
    this.setState(update(this.state, {
      value: {$set: ''}
    }))
  },

  onRemoveTagButtonClick: function () {
    var id = this.state.removeSuggestion.id
    this.props.context.executeAction(actions.removeActivityTag, {
      id: id,
      body: {
        is_canceled: true,
        name_suffix: id //parametr przydatny, gdyby ktoś usunął kategorię a stworzył nową o tej samej nazwie, co usunięta
      }
    })
    this.setState(update(this.state, {
      value: {$set: ''},
      removeSuggestion: {$set: {}},
      showRemoveButton: {$set: false}
    }))
  },
  
  getSuggestions: function() {
    var query = {
      suggest: {
        text: this.state.value,
        completion: {
          field: 'activity_tag_suggest',
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
        console.log(json)
        var suggestions = json.suggest[0].options.map (function (option) {
          return {
            display_name: option.text,
            id: option.payload.id,
            is_canceled: option.payload.is_canceled
          }
        }).filter(function (tag) {
          console.log('TAG', tag)
          if (typeof(tag.is_canceled) == 'boolean' && tag.is_canceled) {
            return false
          }
          if (that.type != 'dodaj') {
            var excludedTags = that.props.excludedTags
            for (var i = 0; i < excludedTags.length; i++) {
              if (tag.id == excludedTags[i].id) {
                return false
              }
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
    this.props.addTag(opts.suggestion)
    this.setState({value: ''})
  },
  
  onAddTagSuggestionSelected: function(evt, opts) {
  },
  
  onRemoveTagSuggestionSelected: function(evt, opts) {
    this.setState(update(this.state, {
      removeSuggestion: {$set: opts.suggestion},
      showRemoveButton: {$set: true}
    }))
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
    var type = this.state.type 
    var typeSelect = <select name="typeSelect" selected={this.state.type}  onChange={this.handleTypeChange} >
                      <option value="dodaj">Dodaj do listy</option>
                      <option value="nowa">Dodaj nową</option>
                      <option value="usun">Usuń istniejącą</option>
                    </select>
                    

    if (this.props.filterMode) {
      return (
            <AutoSuggest
              id="activityTagsFilterMode"
              inputProps={{
                value: this.state.value,
                onChange: this.handleChange
              }}
              suggestions={this.state.suggestions}
              renderSuggestion={this.renderSuggestion}
              getSuggestionValue={this.getSuggestionValue}
              onSuggestionSelected={this.onSuggestionSelected} />
        )
    } else {
      if (type=='dodaj') {
        return (
          <div>
            {typeSelect}
            <AutoSuggest
              id="activityTags"
              inputProps={{
                value: this.state.value,
                onChange: this.handleChange
              }}
              suggestions={this.state.suggestions}
              renderSuggestion={this.renderSuggestion}
              getSuggestionValue={this.getSuggestionValue}
              onSuggestionSelected={this.onSuggestionSelected} />
          </div>
        )
      }
      if (type=='nowa') {
        var createButton
        var that = this
        var showCreateButton = function () {
          var suggestions = that.state.suggestions
          var value = that.state.value
          if (value == '') {
            return false
          }
          for (var i = 0; i < suggestions.length; i++) {
            if ((value+' ') == suggestions[i].display_name) {
              return false
            }
          }
          return true
        }()
        if (showCreateButton) {
          createButton = <input type="button" onClick={this.onCreateTagButtonClick} value="Dodaj" key="createTag" />
        }
        
        return (
          <div>
            {typeSelect}
            <AutoSuggest
              id="createActivityTag"
              inputProps={{
                value: this.state.value,
                onChange: this.handleChange
              }}
              suggestions={this.state.suggestions}
              renderSuggestion={this.renderSuggestion}
              getSuggestionValue={this.getSuggestionValue}
              onSuggestionSelected={this.onAddTagSuggestionSelected} />
              {createButton}
          </div>
        )
      }
      if (type=='usun') {
        var removeButton
        if (this.state.showRemoveButton) {
          removeButton =<span>{this.state.removeSuggestion.display_name} <input type="button" onClick={this.onRemoveTagButtonClick} value="Usuń kategorię" key="removeTag" /></span>
        }
        
        return (
          <div>
            {typeSelect}
            <AutoSuggest
              id="removeActivityTag"
              inputProps={{
                value: this.state.value,
                onChange: this.handleChange
              }}
              suggestions={this.state.suggestions}
              renderSuggestion={this.renderSuggestion}
              getSuggestionValue={this.getSuggestionValue}
              onSuggestionSelected={this.onRemoveTagSuggestionSelected} />
              {removeButton}
          </div>
        )
      }
    }
    
    
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = ActivityTags
