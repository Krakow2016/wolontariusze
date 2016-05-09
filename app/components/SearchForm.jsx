var React = require('react')
var Languages = require('./SearchLanguages.jsx')

var SearchForm = React.createClass({

  propTypes: {
    query: React.PropTypes.object
  },

  render: function() {
    return (
      <div className="searchForm">

        <h2>Dane pochodzące z serwisu</h2>

        <h4>Dane osobowe</h4>
        <div className="pure-g">
          <div className="pure-u-1-3"> Imię i nazwisko </div>
          <div className="pure-u-2-3">
            <input name="name" value={this.props.query.name} onChange={this.props.handleChange} />
          </div>
        </div>
        <div className="pure-g">
          <div className="pure-u-1-3"> E-mail </div>
          <div className="pure-u-2-3">
            <input name="email" value={this.props.query.email} onChange={this.props.handleChange} />
          </div>
        </div>
        <div className="pure-g">
          <div className="pure-u-2-3">
              <input id="has_password" name="doc.has_password" type="checkbox" onChange={this.props.handleCheckboxChange} checked={this.props.query['doc.has_password']} />
              <label htmlFor="has_password"> Posiada aktywne konto w systemie </label>
          </div>
        </div>
        <div className="pure-g">
          <div className="pure-u-2-3">
              <input id="is_admin" name="doc.is_admin" type="checkbox" onChange={this.props.handleCheckboxChange} checked={this.props.query['doc.is_admin']} />
              <label htmlFor="is_admin"> Posiada uprawnienia administratora </label>
          </div>
        </div>

        <h2>Dane pochodzące z rejestracji</h2>

        <div className="pure-g">
          <div className="pure-u-2-3">
              <input id="is_volunteer" name="raw.is_volunteer" type="checkbox" onChange={this.props.handleCheckboxChange} checked={this.props.query['raw.is_volunteer']} />
              <label htmlFor="is_volunteer"> Wolontariusz krótkoterminowy </label>
          </div>
        </div>

        <div className="pure-g">
          <div className="pure-u-2-3">
              <input id="need_accomodation" name="raw.need_accomodation" type="checkbox" onChange={this.props.handleCheckboxChange} checked={this.props.query['raw.need_accomodation']} />
              <label htmlFor="need_accomodation"> Potrzebuje zakwaterowania </label>
          </div>
        </div>
        
        <div className="pure-g">
          <div className="pure-u-1-3">Nr telefonu komórkowego (bez kierunkowego)</div>
          <div className="pure-u-2-3">
            <input name="mobilephone" value={this.props.query.mobilephone} onChange={this.props.handleChange} />
          </div>
        </div>

        <div className="pure-g">
          <div className="pure-u-1-3">Miejsce zamieszkania</div>
          <div className="pure-u-2-3">
            <input name="city" value={this.props.query.city} onChange={this.props.handleChange} />
          </div>
        </div>

        <h4>Doświadczenie i zainteresowania</h4>
        <div className="pure-g">
          <div className="pure-u-1-3">Umiejętności</div>
          <div className="pure-u-2-3">
            <input name="skills" value={this.props.query.skills} onChange={this.props.handleChange} />
          </div>
        </div>
        <div className="pure-g">
          <div className="pure-u-1-3"> Obszary, w których wolontariusz chciałby pełnić służbę </div>
          <div className="pure-u-2-3">
            <input name="sectors" value={this.props.query.sectors} onChange={this.props.handleChange} />
          </div>
        </div>

        <div className="pure-g">
          <div className="pure-u-1-3"> Języki </div>
          <div className="pure-u-2-3">
            <Languages handleLanguagesChange={this.props.handleLanguagesChange}/>
          </div>
        </div>

        <br></br>
        <div className="pure-g">
          <div className="pure-u-1-3"> </div>
          <div className="pure-u-2-3">
            <button type="button" className="button" primary={true} onClick={this.props.search}>Szukaj</button>
            <div id="button-clear"></div>
          </div>
        </div>
      </div>
    )
  }
})

//<div className="pure-g">
  //<div className="pure-u-1-3"> Wiek od </div>
  //<div className="pure-u-7-24">
    //<input name="age-from" value={this.props.query['age-from']} onChange={this.props.handleChange} />
  //</div>
  //<div className="pure-u-2-24" style={{'textAlign': 'center'}}>
    //<span className="range-a">do</span>
  //</div>
  //<div className="pure-u-7-24">
    //<input name="age-to" value={this.props.query['age-to']} onChange={this.props.handleChange} />
  //</div>
//</div>

//<div className="pure-g">
  //<div className="pure-u-1-3"> Języki </div>
  //<div className="pure-u-2-3">
    //<input id="ang" name="language" type="checkbox" value="angielski" onChange={this.props.handleCheckboxChange} /><label htmlFor="ang">Angielski</label>
    //<input id="fre" name="language" type="checkbox" value="francuski" onChange={this.props.handleCheckboxChange} /><label htmlFor="fre">Francuski</label>
    //<input id="spa" name="language" type="checkbox" value="hiszpański" onChange={this.props.handleCheckboxChange} /><label htmlFor="spa">Hiszpański</label>
    //<input id="por" name="language" type="checkbox" value="portugalski" onChange={this.props.handleCheckboxChange} /><label htmlFor="por">Portugalski</label>
    //<input id="ger" name="language" type="checkbox" value="niemiecki" onChange={this.props.handleCheckboxChange} /><label htmlFor="ger">Niemiecki</label>
    //<input id="rus" name="language" type="checkbox" value="rosyjski" onChange={this.props.handleCheckboxChange} /><label htmlFor="rus">Rosyjski</label>
    //<input id="ukr" name="language" type="checkbox" value="ukraiński" onChange={this.props.handleCheckboxChange} /><label htmlFor="ukr">Ukraiński</label>
    //<input id="ita" name="language" type="checkbox" value="włoski" onChange={this.props.handleCheckboxChange} /><label htmlFor="ita">Włoski</label>
    //<input type="checkbox" /><label htmlFor="other"><input name="other_val" name="language" placeholder="inny, jaki?" style={{'width': '100px'}} /></label>
  //</div>
//</div>

//<div className="pure-g">
  //<div className="pure-u-1-3"> Uczestrnisctwo w ŚDM </div>
  //<div className="pure-u-2-3">
    //<input id="rio" type="checkbox" name="wyd" value="rio" onChange={this.props.handleCheckboxChange} />
    //<label htmlFor="rio" >Rio 2013</label>
    //<input id="madrit" type="checkbox" name="wyd" value="madrit" onChange={this.props.handleCheckboxChange} />
    //<label htmlFor="madrit" >Madryt 2011</label>
    //<input id="sydney" type="checkbox" name="wyd" value="sydney" onChange={this.props.handleCheckboxChange} />
    //<label htmlFor="sydney" >Sydney 2008</label>
    //<input id="cologne" type="checkbox" name="wyd" value="cologne" onChange={this.props.handleCheckboxChange} />
    //<label htmlFor="cologne" >Kolonia 2005</label>
    //<input id="toronto" type="checkbox" name="wyd" value="toronto" onChange={this.props.handleCheckboxChange} />
    //<label htmlFor="toronto" >Toronto 2002</label>
    //<input id="rome" type="checkbox" name="wyd" value="rome" onChange={this.props.handleCheckboxChange} />
    //<label htmlFor="rome" >Rzym 2000</label>
    //<input id="paris" type="checkbox" name="wyd" value="paris" onChange={this.props.handleCheckboxChange} />
    //<label htmlFor="paris" >Paryż 1997</label>
  //</div>
//</div>

module.exports = SearchForm
