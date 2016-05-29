var React = require('react')

module.exports = React.createClass({

  render: function(){
    return (
      <div className="content-texts-container">
        <div className="content-texts">
          <h1 className="text--center">Jak Działa Góra Dobra?</h1>
          <ul>
            <li>
              Indywidualne profile dają możliwość udziału w wydarzeniach, umieszczania wpisów czy  dzielenia się efektami swojej pracy. Połączenie z Instagramem pomoże w uwiecznianiu najwspanialszych momentów.
            </li>
            <li>
              Bank pracy – możliwość przypisania się do zadań, planowania i koordynowania pracy. Baza wszystkich aktualnych projektów i zadań niezbędnych do przygotowania i sprawnego przebiegu wydarzeń podczas ŚDM.
            </li>
            <li>
              Budowanie własnej Góry Dobra złożonej z aktywności widocznych na profilu i wzajemna motywacja do działania.
            </li>
          </ul>
        </div>
        <img src="/img/texts/how-min.jpg" alt="Jak Działa Góra Dobra?"/>
      </div>
    )
  }
})
