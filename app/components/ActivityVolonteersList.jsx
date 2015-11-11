var React = require('react')
var AutoSuggest = require('react-autosuggest');


var AutoSuggestVolonteer = React.createClass ({
  getInitialState: function () {
      return {volonteerId: 0};
  },
  getSuggestions: function(input, callback) {
    var allVolonteers = this.props.allVolonteers;
    
    var words = input.split(" ");
    var firstWordRegExp = new RegExp(words[0], 'i');
    var  secondWordRegExp;
    if (words[1]) { secondWordRegExp = new RegExp(words[1], 'i') };
    
    var suggestions = allVolonteers.filter(function (volonteer) {
        if (words.length == 1) {
            return firstWordRegExp.test(volonteer.first_name) || firstWordRegExp.test(volonteer.last_name);
        } else if (words.length == 2) {
            return (firstWordRegExp.test(volonteer.first_name) && secondWordRegExp.test(volonteer.last_name)) ||
                   (secondWordRegExp.test(volonteer.first_name) && firstWordRegExp.test(volonteer.last_name));
        }
    });
    
    setTimeout(callback(null, suggestions.slice(0,5)), 300);
  },
  renderSuggestion: function (suggestion, input) {
    return (
        <span>{suggestion.first_name} {suggestion.last_name} - {suggestion.id}</span>
    );
  },
  getSuggestionValue: function (suggestionObj) {
    this.setState({volonteerId: suggestionObj.id});
    var output = suggestionObj.first_name+" "+suggestionObj.last_name+" - "+suggestionObj.id 
    return output;
  },
  onClick: function () {
    this.props.onAddButtonClick(this.state.volonteerId);
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
        this.props.onRemoveButtonClick(this.props.id);
    },
    render: function () {
            var name = '';
            var volonteers = this.props.allVolonteers;
            var id = this.props.id;
            for (var index = 0; index < volonteers.length; index++) {
                if (volonteers[index].id == id) {
                    name = volonteers[index].first_name+' '+volonteers[index].last_name+' - '+volonteers[index].id;
                    break;
                }
            }
            return (
                <div className="addedVolonteer" ><a href={'/wolontariusz/'+id}>{name}</a> <input type="button" className="addedVolonteerRemoveButton" onClick={this.onClick} value="Usuń"/></div>
            )
    }
})

var ActivityVolonteersList = React.createClass({
    render: function () {
            var that = this
            var list = this.props.data.map (function (volonteerId) {
                return (
                    <AddedVolonteer id={volonteerId} 
                                    onRemoveButtonClick={that.props.onRemoveButtonClick}
                                    allVolonteers={that.props.allVolonteers} />                 
                )
            })
            return (
                <div>
                    <AutoSuggestVolonteer allVolonteers={this.props.allVolonteers} 
                                          onAddButtonClick={this.props.onAddButtonClick} />
                    {list}
                </div>
            )
    }
})

/* Module.exports instead of normal dom mounting */
module.exports = ActivityVolonteersList