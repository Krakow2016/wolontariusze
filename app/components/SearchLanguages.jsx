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
  {value: 'zulu', text: 'Zulu'}
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

    var j
    var opt
    if (language.value != 'other') {
      var language_value = language.value.split('_')[0]
      var basic = language_value+'_basic'
      for(j = 0; j < selectedOptions.length; j++) {
        opt = selectedOptions[j]
        if (opt.value == basic) {
          selectedOptions.splice(j, 5)
        }
      }
    } else {
      for(j = 0; j < selectedOptions.length; j++) {
        opt = selectedOptions[j]
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
          placeholder={'Napisz, aby przefiltrować'}
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