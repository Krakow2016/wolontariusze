var React = require('react')

module.exports = React.createClass({

  render: function(){
    return (
      <div className="faq-content">
        <h1 id="faq-header" className="smooth">Najczęściej zadawane pytania</h1>
        <h2 className="text--center smooth">Ogólne</h2>
        <dl>
          <dt>Kto może mieć konto na Górze Dobra?</dt>
          <dd>Każdy kto jest zarejestrowanym wolontariuszem krótkoterminowym oraz dla koordynatorów KO ŚDM KRAKÓW 2016</dd>
          <dt>Nie dostałem maila aktywującego.</dt>
          <dd>Na stronie https://wolontariusze.krakow2016.com/aktywacja znajduje się formularz dla wolontariuszy krótkoterminowych, którzy nie mają jeszcze aktywnego konta na Górze Dobra. Spróbuj wpisać tam adres e-mail, który podałeś/aś w formularzu watykańskim.</dd>
          <dt>Mam pomysł na udoskonalenie, dodanie innych aplikacji, do kogo mogę napisać?</dt>
          <dd>Wszelkie propozycje, zapytania itp można napisać na adres goradobra@krakow2016.com. Oprócz tego w stopce redakcjyne na głównej stronie portali jest zakłądka "Dla programistów"</dd>
          <dt>Jestem niepełnoletnim wolontariuszem, czy mogę mieć konto na górze dobra?</dt>
          <dd>Zgodnie z przepisami prawa polskiego osoba niepełnoletnia może mieć konto na Górzez DObra po spełnieniu nastpujących warunków wyszczególnionych w par. V. ust. 2. i 3. Regulaminu portalu: 2. Niepełnoletni użytkownik Portalu (poniżej 18 r.ż.) akceptując 
 Regulamin oświadcza, że posiada zgodę swojego przedstawiciela ustawowego
 na założenie Profilu na Portalu i na przetwarzanie swoich danych 
 osobowych. 3. Niepełnoletni użytkownik Portalu zobowiązuje się 
 podać w trakcie aktywacji konta (w profilu) adres email ustawowego 
 opiekuna w celu potwierdzenia tożsamości i zgody opiekuna na założenie 
 Profilu na Portalu przez niepełnoletniego Użytkownika, pozostającego pod
 jego opieką.</dd>
          <dt>Czy mogę kontaktować się poprzez Górę Dobra z innymi wolontariuszami ?</dt>
          <dd>Nie. Portal nie spełnia funkcji socialmediów.</dd>
          <dt>Nie mogę się zalogować pomimo poprawnych danych? Co zrobić?</dt>
          <dd>Należy sprawdzić, czy nie została gdzieś przypadkowo wpisana spacja, jeśli nie to należy zgłosić problem na goradobra@krakow2016.com</dd>
          <dt>Wyskakuje mi zły format adresu, co zrobić?</dt>
          <dd>Należy zgłosić problem na goradobra@krakow2016.com</dd>
          <dt>Ustawienia profilu - Kto będzie widział mój profil?</dt>
          <dd>Profil jest widoczny dla innych zarejestrowanych wolontariuszy i koodrynatorów</dd>
          <dt> Czy mogę zawsze edytować/zaktualizować swoje dane?</dt>
          <dd>Dane osobowe na profilu są niezmienne, gdyż są powiązane bezpośredniu z danymi bazy watykaskiej-czyli rejestracyjnymi na wolontariat krótkoterminowy.Informacje jaki emozna zmienić to : zdjcie i odpowiedzi na pytania w profilu ogólnym.</dd>
          <dt>Czy mogę zmienić mail podany na Górze Dobra?</dt>
          <dd>Nie. Jest to dana niezmienna.</dd>
          <dt>Jaki musi być format zdjęcia profilowego?</dt>
          <dd>JPG, PDF max. wielkośc do 10 MG</dd>
          <dt>Które dane będą ogólnodostępne? A które tylko dla koordynatorów?</dt>
          <dd>Zgodnie z wyszczegónieniem w Regulaminie patrz:par. IV. Zasady korzystania z portalu.</dd>
        </dl>
      </div>
    )
  }
})
