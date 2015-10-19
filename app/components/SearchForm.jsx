var React = require('react')
var actions = require('../actions')

var RaisedButton = require('material-ui/lib/raised-button')

var SearchForm = React.createClass({

  getInitialState: function() {
    return {
      name: "",
      email: "",
      address: "",
      parish: "",
      education: "",
      studies: "",
      departments: "",
      comments: "",
      interests: ""
    }
  },

  handleChange: function(event) {
    var state = {}
    state[event.target.name] = event.target.value
    this.setState(state)
  },

  handleCheckboxChange: function(event) {
    var state = {}
    state[event.target.name] = this.state[event.target.name] || {}
    state[event.target.name][event.target.value] = event.target.checked
    this.setState(state)
  },

  search: function(){

    var age_from = parseInt(this.state['age-from'])
    var age_to = parseInt(this.state['age-to'])

    var languages

    var query = {
      size: 100,
      query : {
        function_score: {
          query : {
            filtered : {
              query: {
                bool: {
                  should: [
                    { bool: {
                    should: [
                      { match: { first_name: this.state.name } },
                      { match: { last_name: this.state.name } },
                    ]
                  }},
                  { match: { email: this.state.email } },
                  { match: { address: this.state.address } },
                  { match: { address2: this.state.address } },
                  { match: { parish: this.state.parish } },
                  { match: { education: this.state.education } },
                  { match: { study_field: this.state.studies } },
                  { match: { departments: this.state.departments } },
                  { match: { comments: this.state.comments } },
                  { bool: {
                    should: [
                      { match: { interests: this.state.interests } },
                      { match: { experience: this.state.interests } }
                    ]
                  }}
                  ],
                  must: []
                },
              },
              filter : { },
            }
          },
          functions: [],
          score_mode: "avg"
        }
      },
      //explain: true,
      highlight : {
        fields : {
          experience: {},
          interests: {},
          departments: {},
          comments: {}
        }
      }
    }

    // Jęzkyki
    var language = this.state.language
    var language_keys = language ? Object.keys(language) : []
    language_keys.forEach(function(key){
      if(language[key]) {
        var range = {}
        range['languages.'+key+'.level'] = { gte: 1, lte: 10 }
        query.query.function_score.query.filtered.query.bool.must.push({range: range})
        query.query.function_score.functions.push({
          field_value_factor: {
            "field" : "languages."+key+".level",
            "modifier" : "square"
          }
        })
      }
    })

    if(this.state['other_val']) {
      var val = this.state['other_val']
      var range = {}
      range['languages.'+val+'.level'] = { gte: 1, lte: 10 }
      query.query.function_score.query.filtered.query.bool.must.push({range: range})
      query.query.function_score.functions.push({
        field_value_factor: {
          "field" : "languages."+val+".level",
          "modifier" : "square"
        }
      })
    }

    // Uczestnictwo w poprzednich Światowych Dniach Młodzieży
    var wyds = this.state.wyd
    var wyds_keys = wyds ? Object.keys(wyds) : []
    if(wyds_keys.length) {
      query.query.function_score.query.filtered.filter.and = []
      wyds_keys.forEach(function(key){
        if(wyds[key]) {
          query.query.function_score.query.filtered.filter.and.push({
            exists: { field: 'previous_wyd.'+key }
          })
        }
      })
    }

    if(age_from || age_to) {
      var today = new Date()
      var range = {
        range: {
          birth_date: {} }}

          if(age_from)
            range.range.birth_date.lte = new Date(new Date().setMonth(today.getMonth() - 12*(age_from-1)))
          if(age_to)
            range.range.birth_date.gte = new Date(new Date().setMonth(today.getMonth() - 12*age_to))

          if(query.query.filtered.filter.and) {
            query.query.filtered.filter.and.push(range)
          } else {
            query.query.filtered.filter.and = [range]
          }
    }

    this.props.context.executeAction(actions.showResults, query)
  },

  render: function() {
    return (
      <div className="searchForm">

        <h4>Dane osobowe</h4>
        <div className="pure-g">
          <div className="pure-u-1-3"> Imię i nazwisko </div>
          <div className="pure-u-2-3">
            <input name="name" value={this.state.name} onChange={this.handleChange} />
          </div>
        </div>
        <div className="pure-g">
          <div className="pure-u-1-3"> E-mail </div>
          <div className="pure-u-2-3">
            <input name="email" value={this.state.email} onChange={this.handleChange} />
          </div>
        </div>
        <div className="pure-g">
          <div className="pure-u-1-3"> Adres (zamieszkania lub zameldowania) </div>
          <div className="pure-u-2-3">
            <input name="address" value={this.state.address} onChange={this.handleChange} />
          </div>
        </div>
        <div className="pure-g">
          <div className="pure-u-1-3"> Parafia </div>
          <div className="pure-u-2-3">
            <input name="parish" value={this.state.parish} onChange={this.handleChange} />
          </div>
        </div>
        <div className="pure-g">
          <div className="pure-u-1-3"> Wiek od </div>
          <div className="pure-u-7-24">
            <input name="age-from" value={this.state['age-from']} onChange={this.handleChange} />
          </div>
          <div className="pure-u-2-24" style={{'text-align': 'center'}}>
            <span className="range-a">do</span>
          </div>
          <div className="pure-u-7-24">
            <input name="age-to" value={this.state['age-to']} onChange={this.handleChange} />
          </div>
        </div>

        <h4>Umiejętności</h4>
        <div className="pure-g">
          <div className="pure-u-1-3"> Wykształcenie </div>
          <div className="pure-u-2-3">
            <input name="education" value={this.state.education} onChange={this.handleChange} />
          </div>
        </div>
        <div className="pure-g">
          <div className="pure-u-1-3"> Kierunek studiów </div>
          <div className="pure-u-2-3">
            <input name="studies" value={this.state.studies} onChange={this.handleChange} />
          </div>
        </div>
        <div className="pure-g">
          <div className="pure-u-1-3"> Języki </div>
          <div className="pure-u-2-3">
            <input id="ang" name="language" type="checkbox" value="angielski" onChange={this.handleCheckboxChange} /><label htmlFor="ang">Angielski</label>
            <input id="fre" name="language" type="checkbox" value="francuski" onChange={this.handleCheckboxChange} /><label htmlFor="fre">Francuski</label>
            <input id="spa" name="language" type="checkbox" value="hiszpański" onChange={this.handleCheckboxChange} /><label htmlFor="spa">Hiszpański</label>
            <input id="por" name="language" type="checkbox" value="portugalski" onChange={this.handleCheckboxChange} /><label htmlFor="por">Portugalski</label>
            <input id="ger" name="language" type="checkbox" value="niemiecki" onChange={this.handleCheckboxChange} /><label htmlFor="ger">Niemiecki</label>
            <input id="rus" name="language" type="checkbox" value="rosyjski" onChange={this.handleCheckboxChange} /><label htmlFor="rus">Rosyjski</label>
            <input id="ukr" name="language" type="checkbox" value="ukraiński" onChange={this.handleCheckboxChange} /><label htmlFor="ukr">Ukraiński</label>
            <input id="ita" name="language" type="checkbox" value="włoski" onChange={this.handleCheckboxChange} /><label htmlFor="ita">Włoski</label>
            <input type="checkbox" /><label htmlFor="other"><input name="other_val" name="language" placeholder="inny, jaki?" style={{"width": "100px"}} /></label>
          </div>
        </div>
        <div className="pure-g">
          <div className="pure-u-1-3"> Doświadczenie i zainteresowania </div>
          <div className="pure-u-2-3">
            <input name="interests" value={this.state.interests} onChange={this.handleChange} />
          </div>
        </div>
        <div className="pure-g">
          <div className="pure-u-1-3"> Sekcja Komitetu ŚDM </div>
          <div className="pure-u-2-3">
            <input name="departments" value={this.state.departments} onChange={this.handleChange} />
          </div>
        </div>

        <h4>Inne</h4>
        <div className="pure-g">
          <div className="pure-u-1-3"> Uczestrnisctwo w ŚDM </div>
          <div className="pure-u-2-3">
            <input id="rio" type="checkbox" name="wyd" value="rio" onChange={this.handleCheckboxChange} />
            <label htmlFor="rio" >Rio 2013</label>
            <input id="madrit" type="checkbox" name="wyd" value="madrit" onChange={this.handleCheckboxChange} />
            <label htmlFor="madrit" >Madryt 2011</label>
            <input id="sydney" type="checkbox" name="wyd" value="sydney" onChange={this.handleCheckboxChange} />
            <label htmlFor="sydney" >Sydney 2008</label>
            <input id="cologne" type="checkbox" name="wyd" value="cologne" onChange={this.handleCheckboxChange} />
            <label htmlFor="cologne" >Kolonia 2005</label>
            <input id="toronto" type="checkbox" name="wyd" value="toronto" onChange={this.handleCheckboxChange} />
            <label htmlFor="toronto" >Toronto 2002</label>
            <input id="rome" type="checkbox" name="wyd" value="rome" onChange={this.handleCheckboxChange} />
            <label htmlFor="rome" >Rzym 2000</label>
            <input id="paris" type="checkbox" name="wyd" value="paris" onChange={this.handleCheckboxChange} />
            <label htmlFor="paris" >Paryż 1997</label>
          </div>
        </div>
        <div className="pure-g">
          <div className="pure-u-1-3"> Uwagi </div>
          <div className="pure-u-2-3">
            <input name="comments" value={this.state.comments} onChange={this.handleChange} />
          </div>
        </div>

        <div className="pure-g">
          <div className="pure-u-1-3"> </div>
          <div className="pure-u-2-3">
            <RaisedButton label="Szukaj" primary={true} onClick={this.search} />
          </div>
        </div>
      </div>
    )
  }
})

module.exports = SearchForm
