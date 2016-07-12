var React = require('react')
var AutoSuggest = require('react-autosuggest')

var TaskSearchInput = React.createClass ({

  propTypes: {
    id: React.PropTypes.string,
    className: React.PropTypes.string,
    selectActivity: React.PropTypes.function
  },

  getInitialState: function () {
    return {
      value: '',
      suggestions: []
    }
  },

  getSuggestions: function(value) {

    // szukane słowa będą oddzielone spacją,
    // zakładam, że wszystkie szukane słowa powinny się znaleźć w description (stąd minimum_should_match),
    // lub wystarczy, że tylko jedno słowo znajdzie się w tytule. Tytuł wg mnie jest ważniejszy od description, dlatego
    // boost 1000
    var docQuery = {
      nested: {
        path: 'doc',
        query: {
          or: [
            {
              match: {
                'doc.name': {
                  query: value,
                  boost: 1000
                }
              }
            },
            {
              match: {
                'doc.description': {
                  query: value,
                  minimum_should_match: '100%'
                }
              }
            }
          ]
        }
      }
    }

    var query = {
      query : {
        function_score: {
          query: docQuery,
          functions: [],
          score_mode: 'avg'
        }
      },
      size: 3
    }

    var that = this
    var request = new XMLHttpRequest()
    request.open('POST', '/search', true)
    request.setRequestHeader('Content-Type', 'application/json')
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var resp = request.responseText
        var json = JSON.parse(resp)

        var hits = json.hits.hits.map(function(hit) {
          return hit._source.doc
        })
        //console.log("HITS", hits)

        var suggestions = hits.map (function (hit) {
          return {
            name: hit.name,
            description: hit.description,
            img_src: (hit.act_type === 'wzialem_od_sdm' ? '/img/flaga2.png' : '/img/flaga.png'),
            activity_id: hit.id,
            search_text: value
          }
        })

        that.setState({
          suggestions: suggestions
        })
      //} else {
      // We reached our target server, but it returned an error
      }
    }

    request.onerror = function() {
      // There was a connection error of some sort
    }

    request.send(JSON.stringify(query))
  },

  renderSuggestion: function (suggestion, input) {


    var imgStyle = {
      float: 'left',
      paddingRight: '5px',
      height: '4.0rem'
    }


    // skomplikowane, ale z testów wynika, że działa
    // Na przykładzie:
    // text: "To jest tekst starego zadania. A to jest treść do drugiego zadania. Natomiast ten tekst należy do nowego zadania"
    // searchInput: "nowe zadanie treść"
    //
    // searchInput zawiera słowa z wyszukiwarki zadań oddzielone spacją np. "nowe zadanie treść". Brane są tylko słowa, które posiadają przynajmniej
    // 2 znaki
    // searchedText oznacza pierwsze słowo z listy, w tym przypadku "nowe"
    // w polu text wyszukiwane jest PIERWSZE WYSTĄPIĘNIE ciągu znaków searchedText. Jeśli zostanie znaleziony, to przechodzimy do części 1,
    // jeśli natomiast nie zostanie znaleziony to przechodzimy do części 2, gdzie zostanie wyświetlona początkowa treść pola text -
    // w naszym przypadku treści zadania.

    // w części 1.1 tworzony jest kontekst dla pierwszego wystąpienia searchedText w text. Składa się on z beginText, searchTextSpan i endText
    // przykładowo moglibyśmy otrzymać:
    // beginText: "... jest treść do drugiego zadania. Natomiast ten tekst należy do "
    // searchTextSpan: <span className="task-search-highlighted-text">nowe</span>
    // endText: "go zadania"
    // w zależności od oryginalnej długości pola text i miejsca, w którym zostanie wykryte pierwsze wystąpienie searchedText to beginText
    // może zaczynać się "..." a endText kończyć "..."

    //z kolei w części 1.2 metoda próbuje zaznaczyć wystąpienia wszystkich słów z searchInput tj ['nowe', 'zadanie', 'treść'], które występują
    //w beginText i endText
    //po transformacji otrzymalibyśmy:
    // beginText: "... jest <span class="task-search-highlighted-text">treść</span> do drugiego zadania. Natomiast ten tekst należy do "
    // endText: "go zadania"
    // endText nie zmienił się ponieważ słowo "zadania" nie zawiera słowo "zadanie".

    // jeśli searchInput byłby ['nowe', 'zadani', 'treść'], to
    // endText byłby "go <span class="task-search-highlighted-text">zadani</span>a"

    // w części 1.3 następuje wyświetlenie

    var createHtmlWithHighlightedText = function (text, searchInput) {

      var searchWords = searchInput.split(' ').filter(function (word) { return word.length > 1 })
      //console.log(searchWords)
      var searchedText = searchWords[0]
      var maxTextLenght = 78
      var searchTextBeginIndex = text.search(new RegExp(searchedText, 'i'))
      var searchTextEndIndex, searchTextSpan
      if (searchTextBeginIndex != -1) {
        //Część 1.1
        searchTextEndIndex = searchTextBeginIndex+searchedText.length
        searchTextSpan = <span className="task-search-highlighted-text">{text.substring(searchTextBeginIndex, searchTextEndIndex)}</span>

        var beginText = ''
        var endText = ''
        var more = '...'
        var leftCharactersFromBegin = searchTextBeginIndex
        var leftCharactersFromEnd = text.length-(searchTextBeginIndex+searchedText.length)
        var leftLength
        if (text.length < maxTextLenght) {
          beginText = text.substring(0, searchTextBeginIndex)
          endText = text.substring(searchTextEndIndex)
        } else if ( leftCharactersFromBegin <= leftCharactersFromEnd && leftCharactersFromBegin+searchedText.length < maxTextLenght) {
          beginText = text.substring(0, searchTextBeginIndex)
          leftLength = maxTextLenght - (leftCharactersFromBegin+searchedText.length)
          endText = text.substring(searchTextEndIndex,searchTextEndIndex+leftLength)+more
        } else if ( leftCharactersFromBegin > leftCharactersFromEnd && leftCharactersFromEnd+searchedText.length < maxTextLenght)  {
          leftLength = maxTextLenght - (leftCharactersFromEnd+searchedText.length)
          beginText = more+text.substring(searchTextBeginIndex-leftLength, searchTextBeginIndex)
          endText = text.substring(searchTextEndIndex)
        } else {
          leftLength = (maxTextLenght - searchedText.length)/2
          beginText = more+text.substring(searchTextBeginIndex-leftLength, searchTextBeginIndex)
          endText = text.substring(searchTextEndIndex,searchTextEndIndex+leftLength)+more
        }

        //Część 1.2
        //zaznaczenie pozostałych słów, jeśli występują w kontekście pierwszego szukanego słowa
        //poczynając od najdłuższego
        var i = 0
        var sortedSearchWords = searchWords.sort(function (a,b) {
          return a.length > b.length
        } )
        for (i = 0 ; i < sortedSearchWords.length; i++ ) {
          var regExpression = new RegExp(sortedSearchWords[i], 'ig')
          var replacedText = '<span class="task-search-highlighted-text">'+sortedSearchWords[i]+'</span>'
          beginText = beginText.replace(regExpression, replacedText)
          endText = endText.replace(regExpression, replacedText)
        }


        //Część 1.3 - wyświetlenie
        function createBeginText () { return { __html: beginText} }
        function createEndText () { return { __html: endText} }
        return (<div>
                  <span dangerouslySetInnerHTML={createBeginText()} />
                  {searchTextSpan}
                  <span dangerouslySetInnerHTML={createEndText()} />
              </div>)

      } else {

          //Część 2
        var more
        if (text.length >= maxTextLenght) {
          more = '...'
        }

        return (
            <div>
              {text.substring(0,maxTextLenght)}
              {more}
            </div>
          )
      }
    }

    var nameText = (suggestion.name.length < 38) ? suggestion.name : suggestion.name.substring(0,38)+'...'
    var descriptionText = createHtmlWithHighlightedText(suggestion.description, suggestion.search_text)

    return (
      <div key={suggestion.user_id}>
        <img src={suggestion.img_src} style={imgStyle}/>
        <div>
          <div>
            <b>{nameText}</b>
          </div>
          <div>
            {descriptionText}
          </div>
        </div>
      </div>
    )
  },

  getSuggestionValue: function (suggestionObj) {
    return suggestionObj.display_name
  },

  onSuggestionSelected: function(evt, opts) {
    this.props.selectActivity(opts.suggestion.activity_id)
    this.setState({value: ''})
  },

  handleChange: function (evt, opts) {
    var value = evt.target.value || ''
    this.setState({
      value: value
    })

    // Zapobiega wywołaniu po zmianie wartości pola przez kliknięcie
    // podpowiedzi.
    if (opts.method === 'type') {
      this.getSuggestions(value)
    }
  },

  render: function () {
    return (
      <AutoSuggest
        id={this.props.id}
        inputProps={{
          value: this.state.value,
          onChange: this.handleChange,
          className: this.props.className,
          placeholder: 'Wyszukaj aktywność'
        }}
        suggestions={this.state.suggestions}
        renderSuggestion={this.renderSuggestion}
        getSuggestionValue={this.getSuggestionValue}
        onSuggestionSelected={this.onSuggestionSelected} />
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = TaskSearchInput
