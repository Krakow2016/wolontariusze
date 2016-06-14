var React = require('react')

module.exports = React.createClass({

  render: function(){
    return (
      <div className="content-texts-container contact text--center">
        <h1>KONTAKT</h1>
        <p>
          Komitet Organizacyjny ŚDM Kraków 2016<br/>
          Departament Wolontariatu / Volunteer's Department <br/>
          Phone: +48 518 309 704<br/>
          E-mail: <a href="mailto:goradobra@krakow2016.com" target="_balnk">goradobra@krakow2016.com</a>
        </p>

        <iframe width="100%" height="450" scrolling="no" src="//www.openstreetmap.org/export/embed.html?bbox=19.935808181762695%2C50.055676741069846%2C19.939348697662354%2C50.05723004406267&amp;layer=mapnik&amp;marker=50.056453398852%2C19.937578439712524" ></iframe><br/><a href="http://www.openstreetmap.org/?mlat=50.05644&amp;mlon=19.93757#map=19/50.05644/19.93757" target="_blank" className="button button--full">Wyświetl większą mapę</a>
      </div>
    )
  }
})
