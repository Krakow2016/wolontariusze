var React = require('react')
var AutoSuggest = require('react-autosuggest');
var config = require('../../config.json')


var AutoSuggestVolonteer = React.createClass ({
  getInitialState: function () {
      return {volonteerId: 0};
  },
  getSuggestions: function(input, callback) {
    var query = {
      suggest: {
        text: input,
        completion: {
          field: "suggest"
        }
      }
    }

    var request = new XMLHttpRequest()
    request.open('POST', '/getSuggestions', true)
    request.setRequestHeader('Content-Type', 'application/json')
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var resp = request.responseText;
        console.log(resp)
        var json = JSON.parse(resp)
        
        var suggestions = json.suggest[0].options.map (function (option) {
          return {
            id: option.payload.id,
            name: option.text,
            email: option.payload.email
          };
        })

        setTimeout(callback(null, suggestions), 300);
      } else {
        console.log('STATUS')
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
    );
  },
  getSuggestionValue: function (suggestionObj) {
    this.setState({volonteer: suggestionObj});
    return suggestionObj.name;
  },
  onClick: function () {
    this.props.onAddButtonClick(this.state.volonteer);
  },
  render: function () {
    return (
      <div>
      <input type="button" onClick={this.onClick} value="Dodaj" />
      <AutoSuggest
                  id="activeVolonteers" 
                  suggestions={this.getSuggestions} 
                  suggestionRenderer={this.renderSuggestion}
                  suggestionValue={this.getSuggestionValue}/>
      </div>
    )
  }
});


var AddedVolonteer = React.createClass({
    onClick: function () {
        this.props.onRemoveButtonClick(this.props.volonteer);
    },
    render: function () {
      return (
        <div className="addedVolonteer" ><a href={'/wolontariusz/'+this.props.volonteer.id}>{this.props.volonteer.name}</a> <input type="button" className="addedVolonteerRemoveButton" onClick={this.onClick} value="Usuń"/></div>
      )
    }
})

var ActivityVolonteersList = React.createClass({
  render: function () {
    var that = this
    var list
    if (this.props.data) {
        list = this.props.data.map (function (volonteer) {
        return (
            <AddedVolonteer volonteer={volonteer}
                            onRemoveButtonClick={that.props.onRemoveButtonClick}/>                 
        )
      })
    }
    return (
      <div>
        <AutoSuggestVolonteer onAddButtonClick={this.props.onAddButtonClick} />
        {list}
      </div>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = ActivityVolonteersList