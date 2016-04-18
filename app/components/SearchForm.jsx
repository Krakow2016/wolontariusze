var React = require('react')
var ReactSelect = require('react-select')
var ReactFilteredMultiselect = require('react-filtered-multiselect')

var allLanguages = {
  arabic: "Arabski",
  azerbaijani: "Azerski",
  belarusian: "Białoruski",
  bulgarian: "Bułgarski",
  bengali: "Bengalski",
  bosnian: "Bośniacki",
  czech: "Czeski",
  
  english: "Angielski",
  german: "Niemiecki",
  polish: "Polski",
  other: "Inny"
}

var allLanguages2 = [
  {value: 'arabic', text: 'Arabski'},
  {value: 'azerbaijani', text: 'Azerski'},
  
  {value: 'english', text: 'Angielski'},
  {value: 'german', text: 'Niemiecki'},
  {value: 'polish', text: 'Polski'},
  {value: 'other', text: 'Inny'}
]

var allLanguages22 = [
  {value: 'arabic_arbitrary', text: 'Arabski - poziom dowolny'},
  {value: 'arabic_basic', text: 'Arabski - podstawowy'},
  {value: 'arabic_good', text: 'Arabski - dobry'},
  {value: 'arabic_excellent', text: 'Arabski - bardzo dobry'},
  {value: 'arabic_interpreter', text: 'Arabski - tłumacz zawodowy'},
  {value: 'arabic_mother', text: 'Arabski - ojczysty'},
  
  {value: 'azerbaijani', text: 'Azerski'},
  {value: 'azerbaijani_arbitrary', text: 'Azerski - poziom dowolny'},
  {value: 'azerbaijani_basic', text: 'Azerski - podstawowy'},
  {value: 'azerbaijani_good', text: 'Azerski - dobry'},
  {value: 'azerbaijani_excellent', text: 'Azerski - bardzo dobry'},
  {value: 'azerbaijani_interpreter', text: 'Azerski - tłumacz zawodowy'},
  {value: 'azerbaijani_mother', text: 'Azerski - ojczysty'},
  
  {value: 'english', text: 'Angielski'},
  {value: 'english_arbitrary', text: 'Angielski - poziom dowolny'},
  {value: 'english_basic', text: 'Angielski - podstawowy'},
  {value: 'english_good', text: 'Angielski - dobry'},
  {value: 'english_excellent', text: 'Angielski - bardzo dobry'},
  {value: 'english_interpreter', text: 'Angielski - tłumacz zawodowy'},
  {value: 'english_mother', text: 'Angielski - ojczysty'},
  
  {value: 'german_arbitrary', text: 'Niemiecki - poziom dowolny'},
  {value: 'german_basic', text: 'Niemiecki - podstawowy'},
  {value: 'german_good', text: 'Niemiecki - dobry'},
  {value: 'german_excellent', text: 'Niemiecki - bardzo dobry'},
  {value: 'german_interpreter', text: 'Niemiecki - tłumacz zawodowy'},
  {value: 'german_mother', text: 'Niemiecki - ojczysty'},
  
  {value: 'polish_arbitrary', text: 'Polski - poziom dowolny'},
  {value: 'polish_basic', text: 'Polski - podstawowy'},
  {value: 'polish_good', text: 'Polski - dobry'},
  {value: 'polish_excellent', text: 'Polski - bardzo dobry'},
  {value: 'polish_interpreter', text: 'Polski - tłumacz zawodowy'},
  {value: 'polish_mother', text: 'Polski - ojczysty'},
   
  {value: 'other', text: 'Inny'}
]

var allLanguages3 = [
  {value: 'arabic', label: 'Arabski'},
  {value: 'azerbaijani', label: 'Azerski'},
  
  {value: 'english', label: 'Angielski'},
  {value: 'german', label: 'Niemiecki'},
  {value: 'polish', label: 'Polski'},
  {value: 'other', label: 'Inny'}
]

/*
var NewLanguage = React.createClass({
  render: function() {

    var that = this
    var data = this.props.data || []
    return (
      <div>
        <ul>
          {data.map(function(li) {
            return (
              <li key={li}>
                <span>{li}</span>
                <input type="button" value="usuń" className="button--xsm btn-category-remove bg--error" data-tag={li} onClick={that.props.onRemove} />
              </li>
              )
          })}
        </ul>
        <NewLanguage onSave={this.props.onSave} />
      </div>
    )
  }
)}

var Languages = React.createClass({
  render: function() {
    var that = this
    var data = this.props.data || []
    return (
      <div>
        <ul>
          {data.map(function(li) {
            return (
              <li key={li}>
                <span>{li}</span>
                <input type="button" value="usuń" className="button--xsm btn-category-remove bg--error" data-tag={li} onClick={that.props.onRemove} />
              </li>
              )
          })}
        </ul>
        <NewLanguage onSave={this.props.onSave} />
      </div>
    )
  }
})*/
var SearchForm = React.createClass({

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

        <h4>Doświadczenie i zainteresowania</h4>
        <div className="pure-g">
          <div className="pure-u-1-3">Umiejętności</div>
          <div className="pure-u-2-3">
            <input name="skills" value={this.props.query.skills} onChange={this.props.handleChange} />
          </div>
        </div>
        <div className="pure-g">
          <div className="pure-u-1-3"> Sekcja Komitetu ŚDM </div>
          <div className="pure-u-2-3">
            <input name="departments" value={this.props.query.departments} onChange={this.props.handleChange} />
          </div>
        </div>
        
        <div className="pure-g">
          <div className="pure-u-1-3"> Języki </div>
          <div className="pure-u-2-3">
            <Languages />
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
