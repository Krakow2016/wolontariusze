var React = require('react')
var ReactSelect = require('react-select')
var ReactFilteredMultiselect = require('react-filtered-multiselect')


var allLanguages = [
  {value: 'arabic_basic', text: 'Arabski - min. poziom podstawowy'},
  {value: 'arabic_good', text: 'Arabski - min. poziom dobry'},
  {value: 'arabic_excellent', text: 'Arabski - min. poziom bardzo dobry'},
  {value: 'arabic_interpreter', text: 'Arabski - min. poziom tłumacz zawodowy'},
  {value: 'arabic_mother', text: 'Arabski - ojczysty'},
  
  {value: 'azerbaijani_basic', text: 'Azerski - min. poziom podstawowy'},
  {value: 'azerbaijani_good', text: 'Azerski - min. poziom dobry'},
  {value: 'azerbaijani_excellent', text: 'Azerski - min. poziom bardzo dobry'},
  {value: 'azerbaijani_interpreter', text: 'Azerski - min. poziom tłumacz zawodowy'},
  {value: 'azerbaijani_mother', text: 'Azerski - ojczysty'},
  
  {value: 'english_basic', text: 'Angielski - min. poziom podstawowy'},
  {value: 'english_good', text: 'Angielski - min. poziom dobry'},
  {value: 'english_excellent', text: 'Angielski - min. poziom bardzo dobry'},
  {value: 'english_interpreter', text: 'Angielski - min. poziom tłumacz zawodowy'},
  {value: 'english_mother', text: 'Angielski - ojczysty'},
  
  {value: 'french_basic', text: 'Francuski - min. poziom podstawowy'},
  {value: 'french_good', text: 'Francuski - min. poziom dobry'},
  {value: 'french_excellent', text: 'Francuski - min. poziom bardzo dobry'},
  {value: 'french_interpreter', text: 'Francuski - min. poziom tłumacz zawodowy'},
  {value: 'french_mother', text: 'Francuski - ojczysty'},
  
  {value: 'german_basic', text: 'Niemiecki - min. poziom podstawowy'},
  {value: 'german_good', text: 'Niemiecki - min. poziom dobry'},
  {value: 'german_excellent', text: 'Niemiecki - min. poziom bardzo dobry'},
  {value: 'german_interpreter', text: 'Niemiecki - min. poziom tłumacz zawodowy'},
  {value: 'german_mother', text: 'Niemiecki - ojczysty'},
  
  {value: 'polish_basic', text: 'Polski - min. poziom podstawowy'},
  {value: 'polish_good', text: 'Polski - min. poziom dobry'},
  {value: 'polish_excellent', text: 'Polski - min. poziom bardzo dobry'},
  {value: 'polish_interpreter', text: 'Polski - min. poziom tłumacz zawodowy'},
  {value: 'polish_mother', text: 'Polski - ojczysty'},
  
  {value: 'portuguese_basic', text: 'Portugalski - min. poziom podstawowy'},
  {value: 'portuguese_good', text: 'Portugalski - min. poziom dobry'},
  {value: 'portuguese_excellent', text: 'Portugalski - min. poziom bardzo dobry'},
  {value: 'portuguese_interpreter', text: 'Portugalski - min. poziom tłumacz zawodowy'},
  {value: 'portuguese_mother', text: 'Portugalski - ojczysty'},
   
  {value: 'other', text: 'Inny'}
]

var Languages = React.createClass({
  getInitialState() {
    return {
      selectedOptions: [{value: 'change', text: 'change'}],
      selectedLanguages: []
    }
  },
  
  deselectLanguage(index) {
    var selectedOptions = this.state.selectedOptions
    var selectedLanguages = this.state.selectedLanguages
    var language = selectedLanguages[index]
    selectedLanguages.splice(index,1)
    
    if (language.value != 'other') {
      var language_value = language.value.split('_')[0]
      var basic = language_value+'_basic' 
      for(var j = 0; j < selectedOptions.length; j++) {
        var opt = selectedOptions[j]
        if (opt.value == basic) {
          selectedOptions.splice(j, 5)
        }
      }
    } else {
      for(var j = 0; j < selectedOptions.length; j++) {
        var opt = selectedOptions[j]
        if (opt.value == 'other') {
          selectedOptions.splice(j, 1)
        }
      }
    }
        
    this.props.handleLanguagesChange(selectedLanguages)    
    this.setState ( {
      selectedOptions: selectedOptions,
      selectedLanguages: selectedLanguages
    })
  },
  handleChange(selected) {
    var selectedLength = selected.length
    var new_language =  selected[selectedLength-1]
    
    var selectedOptions = this.state.selectedOptions
    var selectedLanguages = this.state.selectedLanguages
    
    selectedLanguages.push(new_language)
    
    if (new_language.value != 'other') {
    console.log(new_language.value)
      var language_value = new_language.value.split('_')[0]
      var levels = [language_value+'_basic', 
        language_value+'_good',
        language_value+'_excellent',
        language_value+'_interpreter',
        language_value+'_mother']
        
      for (var i = 0; i < levels.length; i++) {
        var opt
        for (var j=0; j<allLanguages.length; j++) {
          if (allLanguages[j].value == levels[i]) {
            opt = allLanguages[j]
            break
          }
        }
        selectedOptions.push(opt)
      }
    } else {
      selectedOptions.push(new_language)
    }
    
    this.props.handleLanguagesChange(selectedLanguages)
    this.setState ( {
      selectedOptions: selectedOptions,
      selectedLanguages: selectedLanguages
    })
    
  },
  
  
  render() {
    //console.log('STATE', this.state)
    var selectedLanguages = this.state.selectedLanguages
    var selectedOptions = this.state.selectedOptions.map(function (opt) {return opt}) 
    return ( 
      <div>
        <ReactFilteredMultiselect
          onChange={this.handleChange}
          options={allLanguages}
          selectedOptions={selectedOptions}
          buttonText={'Wybierz'}
        />
        {selectedLanguages.length > 0 && <ul>
          {selectedLanguages.map((language, i) => <li key={language.value}>
            {language.text}
            <button type="button" onClick={this.deselectLanguage.bind(null,i)}>Usuń</button>
          </li>)}
        </ul>}
      </div>
    )
  }
})

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
