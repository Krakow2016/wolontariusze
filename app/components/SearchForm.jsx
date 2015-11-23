var React = require('react')
var actions = require('../actions')

var RaisedButton = require('material-ui/lib/raised-button')

var SearchForm = React.createClass({

  getInitialState: function() {
    if(typeof location !== 'undefined') {
      var search = location.search.substring(1)
      if(search) {
        return JSON.parse('{"' + decodeURI(search).replace(new RegExp('"','g'), '\\"')
                                                  .replace(new RegExp('&','g'), '","')
                                                  .replace(new RegExp('=','g'), '":"') + '"}')
      }
    }

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

  componentDidMount: function componentDidMount() {
    if(location.search.substring(1)) {
      this.search()
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
    this.props.context.executeAction(actions.showResults, this.state)
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
          <div className="pure-u-2-24" style={{'textAlign': 'center'}}>
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
