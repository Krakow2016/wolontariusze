var React = require('react')
var ReactFilteredMultiselect = require('react-filtered-multiselect')


var allLanguages = [
  {value: 'arabic', text: 'Arabski'},
  {value: 'azerbaijani', text: 'Azerski'},
  {value: 'belarusian', text: 'Białoruski'},
  {value: 'bulgarian', text: 'Bułgarski'},
  {value: 'bengali', text: 'Bengalski'},
  {value: 'bosnian', text: 'Bośniacki'},
  {value: 'czech', text: 'Czeski'},
  {value: 'danish', text: 'Duński'},
  {value: 'german', text: 'Niemiecki'},
  {value: 'greek', text: 'Grecki'},
  {value: 'english', text: 'Angielski'},
  {value: 'spanish', text: 'Hiszpański'},
  {value: 'estonian', text: 'Estoński'},
  {value: 'persian', text: 'Perski'},
  {value: 'finnish', text: 'Fiński'},
  {value: 'french', text: 'Francuski'},
  {value: 'hebrew', text: 'Hebrajski'},
  {value: 'hindi', text: 'Hindi'},
  {value: 'croatian', text: 'Chorwacki'},
  {value: 'hungarian', text: 'Węgierski'},
  {value: 'armenian', text: 'Armeński'},
  {value: 'indonesian', text: 'Indonezyjski'},
  {value: 'icelandic', text: 'Islandzki'},
  {value: 'italian', text: 'Włoski'},
  {value: 'japanese', text: 'Japoński'},
  {value: 'georgian', text: 'Gruziński'},
  {value: 'kazakh', text: 'Kazachski'},
  {value: 'cambodian', text: 'Kambodżański'},
  {value: 'korean', text: 'Koreański'},
  {value: 'kyrgyz', text: 'Kyrgijski'},
  {value: 'lao', text: 'Laotański'},
  {value: 'lithuanian', text: 'Litewski'},
  {value: 'latvian', text: 'Łotewski'},
  {value: 'malagasy', text: 'Malgaski'},
  {value: 'macedonian', text: 'Macedoński'},
  {value: 'mongolian', text: 'Mongolski'},
  {value: 'malaysian', text: 'Malezyjski'},
  {value: 'maltese', text: 'Maltański'},
  {value: 'burmese', text: 'Birmański'},
  {value: 'nepalese', text: 'Nepalski'},
  {value: 'dutch', text: 'holenderski'},
  {value: 'norwegian', text: 'Norweski'},
  {value: 'nyanja', text: 'Nyanja'},
  {value: 'polish', text: 'Polski'},
  {value: 'portuguese', text: 'Portugalski'},
  {value: 'kirundi', text: 'Rundi'},
  {value: 'romanian', text: 'Rumuński'},
  {value: 'russian', text: 'Rosyjski'},
  {value: 'kinyarwanda', text: 'Kinyarwanda'},
  {value: 'serbian', text: 'Serbski'},
  {value: 'cingalese', text: 'Senegalski'},
  {value: 'slovak', text: 'Słowacki'},
  {value: 'slovenian', text: 'Słoweński'},
  {value: 'samoan', text: 'Samoański'},
  {value: 'shona', text: 'Shona'},
  {value: 'albanian', text: 'Albański'},
  {value: 'swedish', text: 'Szwedzki'},
  {value: 'swahili', text: 'Suahili'},
  {value: 'tamil', text: 'Tamil'},
  {value: 'tajik', text: 'Tadżycki'},
  {value: 'thai', text: 'Tajlandzki'},
  {value: 'turkmen', text: 'Turkmeński'},
  {value: 'filipino', text: 'Filipiński (Takalog)'},
  {value: 'tongan', text: 'Tongan'},
  {value: 'turkish', text: 'Turecki'},
  {value: 'ukrainian', text: 'Ukraiński'},
  {value: 'urdu', text: 'Urdu'},
  {value: 'uzbek', text: 'Uzbecki'},
  {value: 'vietnamese', text: 'Wietnamski'},
  {value: 'xhosa', text: 'Xhosa'},
  {value: 'chinese-cantonese', text: 'Chiński (Kantoński)'},
  {value: 'chinese-mandarin', text: 'Chiński (Mandaryński)'},
  {value: 'zulu', text: 'Zulu'},
]

var allOptions = [
  {value: 'other', text: 'Inny'}
]
for (var i = 0; i < allLanguages.length; i++) {
  allOptions.splice(1+i*5,5,
      {value: allLanguages[i].value+'_basic', text: allLanguages[i].text+' - min. poziom podstawowy'},
      {value: allLanguages[i].value+'_good', text: allLanguages[i].text+' - min. poziom dobry'},
      {value: allLanguages[i].value+'_excellent', text: allLanguages[i].text+' - min. poziom bardzo dobry'},
      {value: allLanguages[i].value+'_interpreter', text: allLanguages[i].text+' - min. poziom tłumacz zawodowy'},
      {value: allLanguages[i].value+'_mother', text: allLanguages[i].text+' - ojczysty'})
}
/*
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
  
  {value: 'belarusian_basic', text: 'Białoruski - min. poziom podstawowy'},
  {value: 'belarusian_good', text: 'Białoruski - min. poziom dobry'},
  {value: 'belarusian_excellent', text: 'Białoruski - min. poziom bardzo dobry'},
  {value: 'belarusian_interpreter', text: 'Białoruski - min. poziom tłumacz zawodowy'},
  {value: 'belarusian_mother', text: 'Białoruski - ojczysty'},
  
  {value: 'bulgarian_basic', text: 'Bułgarski - min. poziom podstawowy'},
  {value: 'bulgarian_good', text: 'Bułgarski - min. poziom dobry'},
  {value: 'bulgarian_excellent', text: 'Bułgarski - min. poziom bardzo dobry'},
  {value: 'bulgarian_interpreter', text: 'Bułgarski - min. poziom tłumacz zawodowy'},
  {value: 'bulgarian_mother', text: 'Bułgarski - ojczysty'},
  
  {value: 'bengali_basic', text: 'Bengalski - min. poziom podstawowy'},
  {value: 'bengali_good', text: 'Bengalski - min. poziom dobry'},
  {value: 'bengali_excellent', text: 'Bengalski - min. poziom bardzo dobry'},
  {value: 'bengali_interpreter', text: 'Bengalski - min. poziom tłumacz zawodowy'},
  {value: 'bengali_mother', text: 'Bengalski - ojczysty'},
  
  {value: 'bosnian_basic', text: 'Bośniacki - min. poziom podstawowy'},
  {value: 'bosnian_good', text: 'Bośniacki - min. poziom dobry'},
  {value: 'bosnian_excellent', text: 'Bośniacki - min. poziom bardzo dobry'},
  {value: 'bosnian_interpreter', text: 'Bośniacki - min. poziom tłumacz zawodowy'},
  {value: 'bosnian_mother', text: 'Bośniacki - ojczysty'},
  
  {value: 'czech_basic', text: 'Czeski - min. poziom podstawowy'},
  {value: 'czech_good', text: 'Czeski - min. poziom dobry'},
  {value: 'czech_excellent', text: 'Czeski - min. poziom bardzo dobry'},
  {value: 'czech_interpreter', text: 'Czeski - min. poziom tłumacz zawodowy'},
  {value: 'czech_mother', text: 'Czeski - ojczysty'},
  
  {value: 'danish_basic', text: 'Duński - min. poziom podstawowy'},
  {value: 'danish_good', text: 'Duński - min. poziom dobry'},
  {value: 'danish_excellent', text: 'Duński - min. poziom bardzo dobry'},
  {value: 'danish_interpreter', text: 'Duński - min. poziom tłumacz zawodowy'},
  {value: 'danish_mother', text: 'Duński - ojczysty'},
  
  {value: 'german_basic', text: 'Niemiecki - min. poziom podstawowy'},
  {value: 'german_good', text: 'Niemiecki - min. poziom dobry'},
  {value: 'german_excellent', text: 'Niemiecki - min. poziom bardzo dobry'},
  {value: 'german_interpreter', text: 'Niemiecki - min. poziom tłumacz zawodowy'},
  {value: 'german_mother', text: 'Niemiecki - ojczysty'},
  
  {value: 'greek_basic', text: 'Grecki - min. poziom podstawowy'},
  {value: 'greek_good', text: 'Grecki - min. poziom dobry'},
  {value: 'greek_excellent', text: 'Grecki - min. poziom bardzo dobry'},
  {value: 'greek_interpreter', text: 'Grecki - min. poziom tłumacz zawodowy'},
  {value: 'greek_mother', text: 'Grecki - ojczysty'},
  
  {value: 'english_basic', text: 'Angielski - min. poziom podstawowy'},
  {value: 'english_good', text: 'Angielski - min. poziom dobry'},
  {value: 'english_excellent', text: 'Angielski - min. poziom bardzo dobry'},
  {value: 'english_interpreter', text: 'Angielski - min. poziom tłumacz zawodowy'},
  {value: 'english_mother', text: 'Angielski - ojczysty'},
  
  {value: 'spanish_basic', text: 'Hiszpański - min. poziom podstawowy'},
  {value: 'spanish_good', text: 'Hiszpański - min. poziom dobry'},
  {value: 'spanish_excellent', text: 'Hiszpański - min. poziom bardzo dobry'},
  {value: 'spanish_interpreter', text: 'Hiszpański - min. poziom tłumacz zawodowy'},
  {value: 'spanish_mother', text: 'Hiszpański - ojczysty'},
  
  {value: 'estonian_basic', text: 'Estoński - min. poziom podstawowy'},
  {value: 'estonian_good', text: 'Estoński - min. poziom dobry'},
  {value: 'estonian_excellent', text: 'Estoński - min. poziom bardzo dobry'},
  {value: 'estonian_interpreter', text: 'Estoński - min. poziom tłumacz zawodowy'},
  {value: 'estonian_mother', text: 'Estoński - ojczysty'},
  
  {value: 'french_basic', text: 'Francuski - min. poziom podstawowy'},
  {value: 'french_good', text: 'Francuski - min. poziom dobry'},
  {value: 'french_excellent', text: 'Francuski - min. poziom bardzo dobry'},
  {value: 'french_interpreter', text: 'Francuski - min. poziom tłumacz zawodowy'},
  {value: 'french_mother', text: 'Francuski - ojczysty'},
  

  
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
*/

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
        for (var j=0; j<allOptions.length; j++) {
          if (allOptions[j].value == levels[i]) {
            opt = allOptions[j]
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
          options={allOptions}
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

module.exports=Languages