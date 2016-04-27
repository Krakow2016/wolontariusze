var React = require('react')

var Instagram = React.createClass({

  render: function(){
    return (
      <div className="content-texts-container">
        <div className="content-texts">
        	<h1 className="text--center">Kto Jest Zaangażowany?</h1>
        	<p>
	        	Górę Dobra tworzą:<br/>
	        	Wolontariusze ŚDM Kraków 2016<br/>
	        	Koordynatorzy wolontariatu<br/>
	        	<br/>
	        	Potrzebujemy osób takich jak Ty- chętnych do współpracy, z pasją i z otwartą głową pełną pomysłów. Osób lubiących nawiązywać nowe znajomości, chcących się rozwijać i dzielić się swoimi zdolnościami z innymi. Tworząc Górę Dobra pragniemy pokazać, że małymi krokami można tworzyć wielkie rzeczy. W książce “Zasada bambusowego krzewu” K. Lodi przytacza opowieść o trzech murarzach:<br/>
	        	„Człowiek przechodzący obok trzech pracujących razem murarzy pyta, co robią.<br/>
	        	- Układam cegły, pod 20 $ za godzinę - odpowiada pierwszy murarz.<br/>
	        	- Buduję mur - mówi drugi.<br/>
	        	<br/>
        		My budujemy Górę Dobra. Zbuduj ją z nami!
        	</p>
        </div>
        <img src="/img/texts/how-min.jpg" alt="Kto Jest Zaangażowany?"/>
      </div>
    )
  }
})

module.exports = Instagram
