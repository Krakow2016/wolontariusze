# Góra dobra

[![Build Status](https://travis-ci.org/Krakow2016/wolontariusze.svg)](https://travis-ci.org/Krakow2016/wolontariusze)
[![Code Climate](https://codeclimate.com/github/Krakow2016/wolontariusze/badges/gpa.svg)](https://codeclimate.com/github/Krakow2016/wolontariusze)
[![Dependency Status](https://david-dm.org/krakow2016/wolontariusze.svg)](https://david-dm.org/krakow2016/wolontariusze)

Oficjalny serwis internetowy prezentujący wolontariuszy i ich pracę w
przygotowaniach do Światowych Dni Młodzieży w Krakowie w 2016 roku, tworzony na
zlecenie sekcji wolontariatu ŚDM.

Masz pytanie? Nie wiesz jak się zaangażować? Zapraszamy do dyskusji na:

[![Join the chat at https://gitter.im/Krakow2016/wolontariusze](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Krakow2016/wolontariusze?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# Wizja

Naszym celem jest budowa narzędzia, które pomaga pomagać. Serwis będzie pełnił
3 funkcje:

* **Administracyjną** - jako narzędzie dla koordynatorów dające im wgląd w bazę danych wolontariuszy oraz jako warstwa autoryzacji dla aplikacji mobilnej dla wolontariuszy.
* **Promocyjną** - jako platforma promująca wolontariuszy jako ludzi aktywnych.
* **Organizacyjną** - jako baza zadań do wykonania przez wolontariuszy w ramach wolontariatu.

Aby to osiągnąć potrzebujemy dwóch stref: publicznej i o ograniczonej
dostępności. Widoczne dla wszystkich będą profile najbardziej aktywnych
wolontariuszy mających realny wpływ na przebieg przygotowań do ŚDM w Krakowie.
Z drugiej strony, po zalogowaniu, użytkownicy z odpowiednimi przywilejami
(koordynatorzy i wolontariusze) otrzymają dostęp do poufnych danych, które będą
im niezbędne przy wykonywaniu swoich zadań.

# Kontrybucje

Ponieważ kod jest otwarty, nie ma ograniczeń co do tego kto może zaproponować
zmiany w kodzie. Aby to zrobić należy przestrzegać prostych zasad.

## Proponowanie zmian

* Dokonaj zmian na gałęzi tematycznej na swojej kopii repozytorium.
* Otwórz [Pull Request](https://github.com/Krakow2016/wolontariusze/pulls) w
projekcie organizacji Krakow2016.
* Poczekaj na przegląd Twoich zmian przez jednego z członków zespołu.
* W zależności od oceny zmian, Twoja propozycja może wymagać dalszych zmian lub
od razu zostać zaakceptowana lub odrzucona.

## Zgłaszanie błędów

Zgłaszanie, dyskusja i rozwiązywanie błędów w aplikacji odbywa się przez
stronę [Issues](https://github.com/Krakow2016/wolontariusze/issues).

# Uruchomienie (zalecane)

Jedyne wymaganie to zainstalowany
[Docker](https://docs.docker.com/engine/installation/) i [Docker
Compose](https://docs.docker.com/compose/install/). Następnie należy pobrać
plik konfiguracyjny
[docker-compose.yml](https://raw.githubusercontent.com/Krakow2016/wolontariusze/master/docker-compose.yml).
Uruchomienie (i wcześniejsze pobranie w przypadku gdy ich brak w systemie)
wszystkich serwisów (kontenerów Dockera) odbywa się za pomocą komendy:

```
docker-compose -f docker-compose.yml up
```

Po wykonaniu wszystkich czynności strona www będzie dostępna na hoście
`localhost` na porcie `8000`.

# Uruchomienie (zaawansowane)

## Pierwszy raz

Aby pobrać kod aplikacji wykonaj komendę [git](https://git-scm.com/), która
skopiuje cały kod wraz z całą historią zmian na Twój lokalny komputer:

    $ git clone https://github.com/Krakow2016/wolontariusze.git && cd wolontariusze/

Kod aplikacji jest w całości pisany w języku JavaScript i uruchamiany w
środowisku *Node.js*. Aby zainstalować to środowisko w najnowszej wersji
podążaj za wskazówkami na stronie [iojs.org](https://iojs.org/en/index.html).
Upewnij się, że instalacja przebiegła poprawnie wykonując polecenie:

    $ node --version
    v2.1.0

Wraz z poleceniem `node` zainstalowane zostanie narzędzie do zarządzania
zależnościami `npm`.

    $ npm --version
    2.10.1

Korzystając z niego możemy zainstalować naszą pierwszą zależność:

    $ npm install -g gulp

Flaga `-g` oznacza, że pakiet zostanie zainstalowany globalnie - dzięki temu
będziemy mieli do niego dostęp z poziomu komendy systemowej (w naszym wypadku
`gulp`).

## Baza danych

Zainstaluj bazę danych RethinkDB według [instrukcji](https://www.rethinkdb.com/docs/install/).

## Serwer www

Przed uruchomieniem serwera www, upewnij się że masz zainstalowane wszystkie zależności. Aby to zrobić wykonaj polecenie:

    $ npm install

W kolejnym kroku musisz utworzyć plik konfiguracyjny `config.json`. Wykorzystaj plik `config.json.example` jako szablon, który zawiera wcześniej zdefiniowane ustawienia dla naszego projektu. 

W pliku konfiguracyjnym możesz zdefiniować m.in. adres do bazy danych i port na którym ma zostać uruchomiony serwer www.

Następnie wykonaj komendę:

    $ gulp

i skieruj się pod adres <http://127.0.0.1:7000>. Powinieneś teraz zobacz stronę
główną naszego serwisu. A teraz czas na programowanie :)

# Testy

Testy wykonywane są standardową komendą `$ npm test`, kóra uruchamia narzędzie
[Jasmine](http://jasmine.github.io/). Wszyskie testy znajdują się w katalogu
`spec/`.

# Licencja MIT

Niniejszym gwarantuje się, bez opłat, że każda osoba, która wejdzie w
posiadanie kopii tego oprogramowania i związanych z nim plików dokumentacji
(dalej "Oprogramowanie") może wprowadzać do obrotu Oprogramowanie bez żadnych
ograniczeń, w tym bez ograniczeń prawa do użytkowania, kopiowania,
modyfikowania, łączenia, publikowania, dystrybuowania, sublicencjonowania i/lub
sprzedaży kopii Oprogramowania a także zezwalania osobie, której Oprogramowanie
zostało dostarczone czynienia tego samego, z zastrzeżeniem następujących
warunków:

Powyższa nota zastrzegająca prawa autorskie oraz niniejsza nota zezwalająca
muszą zostać włączone do wszystkich kopii lub istotnych części Oprogramowania.

OPROGRAMOWANIE JEST DOSTARCZONE TAKIM, JAKIE JEST, BEZ JAKIEJKOLWIEK GWARANCJI,
WYRAŹNEJ LUB DOROZUMIANEJ, NIE WYŁĄCZAJĄC GWARANCJI PRZYDATNOŚCI HANDLOWEJ LUB
PRZYDATNOŚCI DO OKREŚLONYCH CELÓW A TAKŻE BRAKU WAD PRAWNYCH. W ŻADNYM
PRZYPADKU TWÓRCA LUB POSIADACZ PRAW AUTORSKICH NIE MOŻE PONOSIĆ
ODPOWIEDZIALNOŚCI Z TYTUŁU ROSZCZEŃ LUB WYRZĄDZONEJ SZKODY A TAKŻE ŻADNEJ INNEJ
ODPOWIEDZIALNOŚCI CZY TO WYNIKAJĄCEJ Z UMOWY, DELIKTU, CZY JAKIEJKOLWIEK INNEJ
PODSTAWY POWSTAŁEJ W ZWIĄZKU Z OPROGRAMOWANIEM LUB UŻYTKOWANIEM GO LUB
WPROWADZANIEM GO DO OBROTU.
