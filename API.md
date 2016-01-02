## Wprowadzenie

API serwisu dla wolontariuszy ŚDM Kraków 2016 jest oparte o styl REST. Posiada
łatwo przewidywalne ścieżki dostępu zorientowane na zasoby danych. Wykorzystuje
dobrze znane cechy protokołu HTTP takie jak kody błędów i metody HTTP w celu
możliwie jak najlepszej kompatybilności z istniejącymi bibliotekami będącymi
klientami protokołu HTTP. Każda odpowiedź serwera jest zwracana w formacie
JSON. Wszystkie przykłady w dokumentacji korzystają z narzędzia `curl`.

Podstawowa ścieżka dostępu do API to: `https://wolontariusze.krakow2016.com/api/v2/`.

## Autentykacja

Wszystkie zapytania do API muszą być nadane bezpiecznym protokołem HTTPS.
Wszystkie nieszyfrowane zapytania HTTP zwrócą błąd. Wszystkie nieautoryzowane
zapytania do API również zwrócą błąd.

## Błędy

API serwisu wolontariuszy korzysta z konwencjonalnych kodów zwrotnych HTTP do
oznajmienia sukcesu lub porażki zapytania. W praktyce oznacza to, że kody z
zakresu 2xx oznaczają sukces, kody z zakresu 4xx oznaczają błąd spowodowany
błędnie wprowadzonymi danymi (np. brak wymaganego parametru), a kody z zakresu
5xx oznaczają błędy po stronie serwera.

### Atrybuty

| Identyfikator | Opis                                   |
| ---           | ---                                    |
| `status`      | Zawsze "error".                        |
| `type`        | Typ błędu. Np. `authentication_error`. |
| `message`     | Słowny opis błędu.                     |

## OAuth

API serwisu wolontariuszy do autoryzacji zapytań API używa standardu OAuth 2.0.

**Ważne:** aby móc korzystać z protokołu autoryzacji OAuth 2.0, dostawca
aplikacji musi najpierw uzyskać dane uwierzytelniające w postaci:
identyfikatora klienta (`client_id`) oraz sekretu klienta (`client_secret`).

API serwisu wolontariuszy wspiera dwa przypadki użycia:

* Scenariusz *server-side* wspiera aplikacje będące w stanie trwale i bezpiecznie przechowywać dane.
* Scenariusz *client-side* wspiera aplikacje JavaScript działające w środowisku przeglądarki.

### Server-side

Ten scenariusz zaczyna się kiedy użytkownik wykonuje akcję, która wymaga
autoryzacji. Aplikacja przekierowuje użytkownika na adres serwisu wolontariuszy,
który zawiera w sobie parametry zapytania definiujące typ dostępu którego
wymaga aplikacja.

Serwis wolontariuszy kieruje autentykacją użytkownika i jego zgodą, a następnie
zwraca kod dostępu (authorization code). Aplikacja używa kodu dostępu oraz
swojego identyfikatora i sekretu klienta do uzyskania tokenu dostępu (access
token), który może być później używany do autoryzacji zapytań API serwisu
wolontariuszy wykonywanych w imieniu tego użytkownika.

Cały proces składa się z następujących kroków:

**1. Żądanie tokenu dostępu**  
Kiedy użytkownik po raz pierwszy próbuje wykonać akcję wymagającą autoryzacji
API, należy przekierować go pod adres:
`https://wolontariusze.krakow2016.com/api/v2/dialog/authorize`. Poniższa
tabelka opisuje parametry zapytania które należy (lub można) zawrzeć w adresie
URL. Wszystkie wartości danych w zapytaniu muszą być poprawnie zakodowane przy
pomocy kodów ucieczki URL.

| Parametr        | Komentarz |
| ---             | ---       |
| `client_id`     | Wymagany. |
| `redirect_uri`  | Wymagany. |
| `response_type` | Wymagany. |
| `scope`         | Wymagany. |

**2. Zgoda użytkownika**  
W tym kroku użytkownik decyduje czy dać uprawnienie aplikacji do wykonywania
zapytań do API serwisu wolontariuszy w jego imieniu. Serwis wolontariuszy
wyświetla nazwę aplikacji żądającej uprawnień. Użytkownik może wybrać czy chce
aplikację upoważnić czy odrzucić.  Pytanie pojawia się zawsze, bez względu na
to czy zgoda została już wcześniej wydana.

**3. Obsługa odpowiedzi**  
Po podjęciu decyzji przez użytkownika, serwis wolontariuszy przekierowuje
użytkownika na adres `redirect_uri`, który został ustalony w kroku 1.

Jeżeli użytkownik wyraził zgodę na dostęp aplikacji, do adresu zostanie
dopisany parametr `code`. Wartość tego parametru to kod dostępu, który może
zostać wymieniony na token dostępu (opis w kroku 4).

**4. Wymiana kodu dostępu na token dostępu**  
Zakładając że użytkownik upoważnił Twoją aplikację do dostępu, należy teraz
wymienić kod dostępu na token dostępu. Aby tego dokonać należy wysłać zapytanie
POST na adres `https://wolontariusze.krakow2016.com/api/v2/oauth/token`
dołączając poniższe pary klucz-wartość w ciele zapytania:

| Parametr        | Komentarz                  |
| ---             | ---                        |
| `code`          | Kod dostępu.               |
| `client_id`     | Identyfikator klienta API. |
| `client_secret` | Sekret klienta API.        |
| `redirect_uri`  | Zwrotny adres URL.         |
| `grant_type`    | Zawsze `"*"`.              |

**5. Obsługa odpowiedzi i zapisanie danych**  
API serwisu wolontariuszy w odpowiedzi na zapytanie POST zwróci obiekt JSON z
tokenem dostępu.

```json
{
  "access_token": "YNmPUK9W72TVrxOlPlDysnimcIfX2qdKsDtPpXraczYGtuJ3CdjJn8ZYkos6Ckn7",
  "token_type": "Bearer"
}
```

### Client-side

*TODO*

### Wywoływanie zapytań do API serwisu wolontariuszy

Po uzyskaniu tokenu dostępu dla użytkownika, aplikacja może używać tokenu do
wysyłania w imieniu użytkownika autoryzowanych zapytań do API.

API serwisu wolontariuszy wymaga aby token dostępu był wysłany w nagłówku
`Authorization: Bearer`.

Używając narzędzia cURL, przykładowe zapytanie będzie wyglądało w następujący sposób:

```
curl -H "Authorization: Bearer ACCESS_TOKEN" https://wolontariusze.krakow2016.com/api/v2/volunteers/e5725fc8-1837-4a32-823c-2f08c7a8b3a1
```

API zwróci kod HTTP 401 (Brak autoryzacji) jeżeli przesłane zapytanie będzie
zawierać nieprawidłowy albo wygały token dostępu lub będzie nieuprawnione z
innego powodu.

## Wolontariusze

Wolontariusze są użytkownikami systemu. API umożliwia pobieranie i aktualizację
danych pojedynczych wolontariuszy, jak również listowanie wolontariuszy.

### Atrybuty

| Klucz                 | Opis                                                    |
| ---                   | ---                                                     |
| `id`                  |                                                         |
| `email`               | Adres e-mail.                                           |
| `first_name`          | Imię.                                                   |
| `last_name`           | Nazwisko.                                               |
| `phone`               | Numer telefonu kontaktowego.                            |
| `profile_picture_url` | Adres url do zdjęcia profilowego.                       |
| `is_admin`            | 'true' jeżeli użytkownik ma uprawnienia administratora. |
| `is_approved`         | 'true' jeżeli użytkownik może logować się w systemie.   |

### Pobieranie obiektu wolontariusza

**Ścieżka:**  
```
GET https://wolontariusze.krakow2016.com/api/v2/volunteers/:id
```

**Przykładowe zapytanie:**  
```
$ curl https://wolontariusze.krakow2016.com/api/v2/volunteers/e5725fc8-1837-4a32-823c-2f08c7a8b3a1
```

**Przykładowa odpowiedź:**  
```json
{
  status: "success",
  data: {
    "id": "e5725fc8-1837-4a32-823c-2f08c7a8b3a1",
    "email": "faustyna@kowalska.pl",
    "first_name": "Faustyna",
    "last_name": "Kowalska",
    "phone": "+48123456789",
    "is_admin": true,
    "is_approved": true
  }
}
```

### Aktualizacja obiektu wolontariusza

**Ścieżka:**  
```
POST https://wolontariusze.krakow2016.com/api/v2/volunteers/:id
```

**Przykładowe zapytanie:**  
```
$ curl https://wolontariusze.krakow2016.com/api/v2/volunteers/123
```

**Przykładowa odpowiedź:**  
```
{}
```

### Listowanie wolontariuszy

**Ścieżka:**  
```
GET https://wolontariusze.krakow2016.com/api/v2/volunteers
```

**Przykładowe zapytanie:**  
```
$ curl https://wolontariusze.krakow2016.com/api/v2/volunteers
```

**Przykładowa odpowiedź:**  
```
{}
```

## Zadania

Zadania są dodatkową pracą której wolontariusze będą mogli się podjąć i zgłosić
się do niej. API umożliwia tworzenie, usuwanie i aktualizację zadań oraz
pobieranie pojedynczych zadań jak i ich całej listy.

| Klucz         | Opis                                                    |
| ---           | ---                                                     |
| `id`          |                                                         |
| `datetime`    | Data i czas rozpoczęcia zadania.                        |
| `description` | Opis zadania.                                           |
| `is_urgent`   | Flaga dla zadań oznaczonych jako pilne.                 |
| `lat_lon`     | Współrzędne geograficzne miejsca wykonywania zadania.   |
| `limit`       | Limit osób które mogą zgłosić się do zadania.           |
| `name`        | Nazwa zadania.                                          |
| `place`       | Opis miejsca wykonywania zadania.                       |
| `volunteers`  | Tablica wolontariuszy zgłoszonych do wykonania zadania. |

### Tworzenie obiektu zadania

**Ścieżka:**  
```
POST https://wolontariusze.krakow2016.com/api/v2/tasks
```

**Przykładowe zapytanie:**  
```
$ curl https://wolontariusze.krakow2016.com/api/v2/tasks
```

**Przykładowa odpowiedź:**  
```
{}
```

### Pobieranie obiektu zadania

**Ścieżka:**  
```
GET https://wolontariusze.krakow2016.com/api/v2/tasks/:id
```

**Przykładowe zapytanie:**  
```
$ curl https://wolontariusze.krakow2016.com/api/v2/tasks/123
```

**Przykładowa odpowiedź:**  
```
{}
```

### Aktualizacja obiektu zadania

**Ścieżka:**  
```
POST https://wolontariusze.krakow2016.com/api/v2/tasks/:id
```

**Przykładowe zapytanie:**  
```
$ curl https://wolontariusze.krakow2016.com/api/v2/tasks/123
```

**Przykładowa odpowiedź:**  
```
{}
```

### Wysłanie zgłoszenia do zadania

**Ścieżka:**  
```
POST https://wolontariusze.krakow2016.com/api/v2/tasks/:id/join
```

**Przykładowe zapytanie:**  
```
$ curl https://wolontariusze.krakow2016.com/api/v2/tasks/123/join
```

**Przykładowa odpowiedź:**  
```
{}
```

### Usunięcie obiektu zadania

**Ścieżka:**  
```
DELETE https://wolontariusze.krakow2016.com/api/v2/tasks/:id
```

**Przykładowe zapytanie:**  
```
$ curl https://wolontariusze.krakow2016.com/api/v2/tasks/123
```

**Przykładowa odpowiedź:**  
```
{}
```

### Listowanie zadań

**Ścieżka:**  
```
GET https://wolontariusze.krakow2016.com/api/v2/tasks
```

**Przykładowe zapytanie:**  
```
$ curl https://wolontariusze.krakow2016.com/api/v2/tasks
```

**Przykładowa odpowiedź:**  
```
{}
```

## Baza noclegowa

*TODO*
