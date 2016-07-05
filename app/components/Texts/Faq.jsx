var React = require('react')
var Question = require('./Question.jsx')

module.exports = React.createClass({

  render: function(){
    return (
      <div className="faq-content">
        <h1 id="faq-header" className="smooth">Najczęściej zadawane pytania</h1>
        <h2 className="text--center smooth">Ogólne</h2> 
        <Question question="Kto może mieć konto na Górze Dobra ?" answer="Każdy kto jest zarejestrowanym wolontariuszem krótkoterminowym oraz dla koordynatorów KO ŚDM KRAKÓW 2016" />
        <Question question="Nie dostałem maila aktywującego." answer="Na stronie https://wolontariusze.krakow2016.com/aktywacja znajduje się formularz dla wolontariuszy krótkoterminowych, którzy nie mają jeszcze aktywnego konta na Górze Dobra. Spróbuj wpisać tam adres e-mail, który podałeś/aś w formularzu watykańskim." />
        <Question question="Mam pomysł na udoskonalenie, dodanie innych aplikacji, do kogo mogę napisać ?" answer="Wszelkie propozycje, zapytania itp można napisać na adres goradobra@krakow2016.com. Oprócz tego w stopce redakcjyne na głównej stronie portali jest zakłądka Dla programistów " />
        <Question question="Jestem niepełnoletnim wolontariuszem, czy mogę mieć konto na górze dobra ?" answer="Zgodnie z przepisami prawa polskiego osoba niepełnoletnia może mieć konto na Górzez DObra po spełnieniu nastpujących warunków wyszczególnionych w par. V. ust. 2. i 3. Regulaminu portalu: 2. Niepełnoletni użytkownik Portalu (poniżej 18 r.ż.) akceptując Regulamin oświadcza, że posiada zgodę swojego przedstawiciela ustawowego na założenie Profilu na Portalu i na przetwarzanie swoich danych osobowych. 3. Niepełnoletni użytkownik Portalu zobowiązuje się podać w trakcie aktywacji konta (w profilu) adres email ustawowego opiekuna w celu potwierdzenia tożsamości i zgody opiekuna na założenie Profilu na Portalu przez niepełnoletniego Użytkownika, pozostającego pod jego opieką." />
        <Question question="Czy mogę kontaktować się poprzez Górę Dobra z innymi wolontariuszami ?" answer="Nie. Portal nie spełnia funkcji socialmediów." />
        <Question question="Nie mogę się zalogować pomimo poprawnych danych? Co zrobić ?" answer="Należy sprawdzić, czy nie została gdzieś przypadkowo wpisana spacja, jeśli nie to należy zgłosić problem na goradobra@krakow2016.com" />
        <Question question="Wyskakuje mi zły format adresu, co zrobić ?" answer="Należy zgłosić problem na goradobra@krakow2016.com" />
        <Question question="Ustawienia profilu - Kto będzie widział mój profil ?" answer="Profil jest widoczny dla innych zarejestrowanych wolontariuszy i koodrynatorów" />
        <Question question="Czy mogę zawsze edytować/zaktualizować swoje dane ?" answer="Dane osobowe na profilu są niezmienne, gdyż są powiązane bezpośredniu z danymi bazy watykaskiej-czyli rejestracyjnymi na wolontariat krótkoterminowy.Informacje jaki emozna zmienić to : zdjcie i odpowiedzi na pytania w profilu ogólnym." />
        <Question question="Czy mogę zmienić mail podany na Górze Dobra ?" answer="Nie. Jest to dana niezmienna." />
        <Question question="Jaki musi być format zdjęcia profilowego ?" answer="JPG, PDF max. wielkośc do 10 MG" />
        <Question question="Które dane będą ogólnodostępne? A które tylko dla koordynatorów ?" answer="Zgodnie z wyszczegónieniem w Regulaminie patrz:par. IV. Zasady korzystania z portalu." />
        <Question question="" answer="" />
        <h2 className="text--center smooth">Bank Pracy</h2> 
        <Question question="Do czego służy bank pracy ?" answer="Bank pracy to miejsce, gdzie koordynatorzy umieszczają swoje zadania do wykonania dla wolontariuszy. Są tam wszystkie informacje przydatne do danego zadania, a wolontariusze mają możliwość zgłaszania się do tych, ktore ich interesują." />
        <Question question="Czy mogę dodać zadanie do Banku Pracy ?" answer="Zadania mogą dodawać tylko koordynatorzy." />
        <Question question="Co oznacza typ zadania (wziąłem/dałem dla ŚDM) ?" answer="Dałem - poświeciłem swój czas na wykonanie tego zadania. Wziąłem - brałem udział w jakimś wydarzeniu orzgotowaniym przez KO ŚDM np.koncert, impreza integracyjna, a nie wykonywałem prac przy tym zadaniu." />
        <Question question="Jak najszybciej wyszukać konkretne zadanie ?" answer="W Banku pracy wszystkie zadania do których moża się aktualnie zapisać są widoczne." />
        <Question question="Jak wyszukać konkretne zadanie nie znając autora ( Które ktoś mi polecił i do którego chce się zapisać )" answer="Nie ma takiej możliwości. Nie ma wyszukiwarki zadań." />
        <Question question="" answer="" />
        <h2 className="text--center smooth">Dodawanie Zadań</h2> 
        <Question question="Jakie mogą być kategorie zadań ?" answer='Kategorie zadań mogą służyć pogrupowaniu powiązanych ze sobą zadań oraz pomagać w ich wyszukiwaniu za pomocą filtrów w Banku Pracy. Kategorie mogą być np. związane z pewnym wydarzeniem, sekcją lub projektem np. "Wolontariat+". Przykładowo, jeśli chcemy utworzyć zestaw aktywności związanych z wydarzeniem "Studniówka ŚÐM" np. "Zapisy na Studniówkę ŚÐM", "Sprzątanie sali po studniówce", "Poznaj wolontariusza ze Studniówki" możemy im nadać wspólną kategorię "Studniówka". Albo jeśli chcemy np. utworzyć zadanie, które wchodzi w obszar projektu "Wolontariat+" możemy mu nadać taką kategorię.' />
        <Question question="Jaki może być typ zadania ?" answer='Wprowadziliśmy 2 typy zadań: Należy wstawić typ "Wziąłęm od ŚDM" w przypadku aktywności, w której wolontariusz coś zyskuje dzięki ŚDM, np. aktywność, w której deklarujemy udział w imprezie integracyjnej. Natomiast typ "Dałem dla ŚDM" oznacza aktywność, w której wolontariusz wykonuje pewną pracę dla ŚÐM, np. "Pomoc przy sprzątaniu biura Komitetu Organizacyjnego ŚÐM".' />
        <Question question="Co zrobić kiedy zadanie nie ma konkretnego miejsca ?" answer="Tzn. że może być ono wykonane np.zdalnie - nie ma konkretnego miesca, gdzie wolontariusz miałby go wykonać" />
        <Question question="Czy zadania trzeba tłumaczyć na różne języki ?" answer="Portal obecnie działa tylko dla wolontariuszy polskich." />
        <Question question="Jaka jest różnica miedzy zadaniem prywatnym a publicznym ?" answer="Zadanie prywatne: koordynator sam zaprasza wybranych do zadania wolontariuszy i wówczas nie jest ono widoczne w Banku pracy, a informacje o nim otrzymuja tylko ci wybrani wolontariusze. Zadanie publiczne: zgłaszają si do niego wolontariusze samodzielnie i jest ono widoczne w Banku pracy." />
        <Question question="" answer="" />
        <h2 className="text--center smooth">Aplikacja Mobilna</h2> 
        <Question question="Czym jest aplikacja mobilna i co ma wspólnego z Górą Dobra" answer='Podczas ŚDM narzędziem wspomagającym portal "Góra Dobra" będzie aplikacja mobilna dla wolontariuszy, bezpośrednio z nim skorelowana, działająca na Android i iOS. Dane dostępowe do aplikacji oraz tablica z pracami do wykonania będą pochodziły z API, które publicznie udostępnia Góra Dobra.' />
        <Question question="Na jakich urządzeniach mogę korzystać z aplikacji mobilnej ?" answer="Wszystkich urzadzeniach mobilnych posiadających dostęp do Internetu oraz działajacych na systemach operacyjnych iOS lub Android" />
        <Question question="W jaki sposób będę otrzymywać i wysyłać informacje na aplikacji ?" answer="Wszystkie informacje wolontariusz bęzie otrzymywać na swojego maila." />
        <Question question="Czy muszę mieć konto w Górze Dobra,żeby korzystać z aplikacji mobilnej ?" answer="Tak. Dostęp do aplikacji będzie odbywał sie przez portal Góra Dobra." />
        <Question question="" answer="" />
      </div>
    )
  }
})
