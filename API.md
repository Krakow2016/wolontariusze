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
| `status`      | Zawsze `"error"`.                      |
| `type`        | Typ błędu. Np. `authentication_error`. |
| `message`     | Słowny opis błędu.                     |

## Cache

Wszystkie zapytnia zwracają nagłówek `ETag`, który należy zapisywać po stronie
klienta i przekazać go przy kolejnym zapytaniu w nagłówku `If-None-Match`.
Jeżeli zasób się nie zmienił od czasu ostatniego zapytania, to zapytanie zwróci
pustą odpowiedź ze statusem 304 (Not Modified).

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
curl -H "Authorization: Bearer ACCESS_TOKEN" -H "Content-Type: application/json" https://wolontariusze.krakow2016.com/api/v2/volunteers/e5725fc8-1837-4a32-823c-2f08c7a8b3a1
```

API zwróci kod HTTP 401 (Brak autoryzacji) jeżeli przesłane zapytanie będzie
zawierać nieprawidłowy albo wygały token dostępu lub będzie nieuprawnione z
innego powodu.

W kolejnych przykładach, dla większej przejrzystości, pomijamy nagłówki
`Authorization` i `Content-Type`, aczkolwiek należy pamiętać o tym że były one
obecne przy wysyłaniu przytoczonych poniżej przykładnowych zapytań.

## Wolontariusze

Wolontariusze są użytkownikami systemu. API umożliwia pobieranie i aktualizację
danych pojedynczych wolontariuszy, jak również listowanie wolontariuszy.
Przykłady użycia są zawarte w pliku:
<https://github.com/Krakow2016/wolontariusze/blob/master/spec/api_volunteer_spec.js>.

### Atrybuty

| Klucz                 | Pomijalny | Opis                                                                |
| ---                   | ---       | ---                                                                 |
| `id`                  | Nie       |                                                                     |
| `email`               | Nie       | Adres e-mail.                                                       |
| `first_name`          | Nie       | Imię.                                                               |
| `last_name`           | Nie       | Nazwisko.                                                           |
| `is_admin`            | Tak       | 'true' jeżeli użytkownik ma uprawnienia administratora.             |
| `is_approved`         | Tak       | 'true' jeżeli użytkownik może logować się w systemie.               |
| `phone`               | Tak       | Numer telefonu kontaktowego. Np. `"+48 123456789"`.                 |
| `profile_picture_url` | Tak       | Adres url do zdjęcia profilowego.                                   |
| `responsibilities`    | Tak       | Zakres obowiązków koordynatora (wypełniany tylko dla kont adminów). |
| `tags`                | Tak       | Lista grup do których wolontariusz został przypisany.               |
| `thumb_picture_url`   | Tak       | Adres url do miniatury zdjęcia profilowego.                         |

### Tworzenie obiektu wolontariusza

Pozwala administratorom na dodawanie nowych użytkowników do systemu.

**Wymagane uprawnienia:**

Ta ścieżka jest dostępna jedynie dla użytkowników którzy są administratorami w
systemie (flaga `is_admin` jest `true`). Zapytania użytkowników bez
odpowiednich uprawnień zwrócą błąd `403` (brak dostępu).

**Ścieżka:**  
```
POST https://wolontariusze.krakow2016.com/api/v2/volunteers/
```

**Przykładowe zapytanie:**  
```
$ curl https://wolontariusze.krakow2016.com/api/v2/volunteers/
```

**Przykładowa odpowiedź:**  
```
{}
```

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
  "status": "success",
  "data": {
    "volunteer": {
      "id": "e5725fc8-1837-4a32-823c-2f08c7a8b3a1",
      "email": "faustyna@kowalska.pl",
      "first_name": "Faustyna",
      "last_name": "Kowalska",
      "phone": "+48123456789",
      "is_admin": true,
      "is_approved": true
    }
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

## Aktywności i zadania

Zadania są dodatkową pracą której wolontariusze będą mogli się podjąć i zgłosić
się do niej. Aktywność jest klasą, od której wywodzą się zadania oraz inne
zdarzenia które wolontariusz będzie mógł samodzielnie zalogować w systemie. API
umożliwia tworzenie, usuwanie i aktualizację aktywności oraz pobieranie
pojedynczych aktywności jak i całej listy aktywności.
Przykłady użycia są zawarte w pliku:
<https://github.com/Krakow2016/wolontariusze/blob/master/spec/api_activity_spec.js>.

| Klucz         | Pomijalny | Opis                                                                                                                                              |
| ---           | ---       | ---                                                                                                                                               |
| `id`          | Nie       |                                                                                                                                                   |
| `created_at`  | Nie       | Czas utworzenia aktywności.                                                                                                                       |
| `created_by`  | Nie       | Obiekt użytkownika dodającego zadanie. Zawiera pola: `id`, `first_name`, `last_name` oraz opcjonalnie `profile_picture_url` i `responsibilities`. |
| `description` | Nie       | Opis aktywności. Format: *RawDraftContentState* (patrz niżej).                                                                                    |
| `name`        | Nie       | Nazwa aktywności.                                                                                                                                 |
| `volunteers`  | Nie       | Tablica wolontariuszy zgłoszonych do wykonania zadania.                                                                                           |
| `duration`    | Tak       | Opis słowny czasu trwania zadania.                                                                                                                |
| `starts_at`   | Tak       | Data i czas rozpoczęcia zadania. Np. ""                                                                                                           |
| `is_urgent`   | Tak       | `true` dla zadań oznaczonych jako pilne.                                                                                                          |
| `lat_lon`     | Tak       | Współrzędne geograficzne miejsca wykonywania aktywności. Np. `[0.0, 0.0]`.                                                                        |
| `limit`       | Tak       | Limit osób które mogą zgłosić się do zadania. Np. `10`.                                                                                           |
| `place`       | Tak       | Opis miejsca wykonywania zadania. Np. `"Sankruarium św. Jana Pawła II"`.                                                                          |
| `updates`     | Tak       | Tablica aktualizacji do treści zadania.                                                                                                           |

### Opis obiektu aktualizacji zadania:

| Klucz        | Opis                                                            |
| ---          | ---                                                             |
| `created_by` | Identyfikator użytkownika dodającego aktualizację.              |
| `created_at` | Czas dodania aktualizacji.                                      |
| `body`       | Treść aktualości. Format: *RawDraftContentState* (patrz niżej). |

### Opis obiektu typu *RawDraftContentState*:

| Klucz           | Opis                                                                                |
| ---             | ---                                                                                 |
| `blocks`        | Lista obiektów typu `ContentBlock` reprezentujących stan pojedynczego bloku tekstu. |
| `blocks[].text` | Czysty tekst bloku.                                                                 |

### Tworzenie obiektu aktywności

**Ścieżka:**  
```
POST https://wolontariusze.krakow2016.com/api/v2/activities
```

**Przykładowe zapytanie:**  
```
$ curl https://wolontariusze.krakow2016.com/api/v2/activities -d '{"name": "nazwa"}'
```

**Przykładowa odpowiedź:**  
```json
{
    "status": "success",
    "data": {
        "activity": {
            "created_at": "2016-02-01T22:50:08.906Z",
            "id": "0565ea98-86bf-4d5f-a3da-3236c8c3a876",
            "name": "nazwa",
            "user_id": "1"
        }
    }
}
```

### Pobieranie obiektu aktywności

**Ścieżka:**  
```
GET https://wolontariusze.krakow2016.com/api/v2/activities/:id
```

**Przykładowe zapytanie:**  
```
$ curl https://wolontariusze.krakow2016.com/api/v2/activities/5102bb7d-651e-49b1-84a9-6f9460287fce
```

**Przykładowa odpowiedź:**  
```json
{
    "status": "success",
    "data": {
        "activity": {
            "act_type": "",
            "created_at": "2016-03-28T21:16:52.689Z",
            "created_by": {
                "first_name": "Karol",
                "id": "2",
                "last_name": "Wojty\u0142a",
                "profile_picture_url": "https://krakow2016.s3.eu-central-1.amazonaws.com/2/avatar?57ae215a9beb713e4475fc9e7623132a\"",
                "responsibilities": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis viverra vel neque sit amet condimentum. Vestibulum sit amet ornare nisl. Nam porttitor arcu sed ultrices dapibus. Nullam ultrices ligula in dignissim commodo. "
            },
            "datetime": "2016-05-24T21:01:45.489Z",
            "description": {
                "blocks": [
                    {
                        "depth": 0,
                        "entityRanges": [],
                        "inlineStyleRanges": [],
                        "key": "asu40",
                        "text": "Tre\u015b\u0107 zadania",
                        "type": "unstyled"
                    }
                ],
                "entityMap": {}
            },
            "duration": "",
            "id": "5102bb7d-651e-49b1-84a9-6f9460287fce",
            "limit": 5,
            "name": "Tytu\u0142 zadania",
            "place": "",
            "updated_at": "2016-05-24T21:01:49.887Z",
            "volunteers": [
                {
                    "first_name": "Karol",
                    "id": "98630ba85f5f5fc7273fba5ecc125f740d1a727a8cac905f98b3ecc34782bccc",
                    "last_name": "Wojty\u0142a",
                    "profile_picture_url": "https://krakow2016.s3.eu-central-1.amazonaws.com/2/avatar?57ae215a9beb713e4475fc9e7623132a\"",
                    "thumb_picture_url": "https://krakow2016.s3.eu-central-1.amazonaws.com/2/thumb?ba35a3d499405de4f1114b796b2904c9\"",
                    "user_id": "2"
                },
                {
                    "first_name": "Faustyna",
                    "id": "00ea70c378b01bdc332edce822189edd40af94c982f6148047fb285b24adeb77",
                    "last_name": "Kowalska",
                    "profile_picture_url": "https://krakow2016.s3.eu-central-1.amazonaws.com/1/avatar?03a8646cff472ee1a1a2de2e247355b2",
                    "thumb_picture_url": "https://krakow2016.s3.eu-central-1.amazonaws.com/1/thumb?40e207b3121deb0e4486ef0397e78a14",
                    "user_id": "1"
                }
            ]
        }
    }
}
```

### Aktualizacja obiektu aktywności

*Wymagane uprawnienia:* administrator.

**Ścieżka:**  
```
POST https://wolontariusze.krakow2016.com/api/v2/activities/:id
```

**Przykładowe zapytanie:**  
```
$ curl https://wolontariusze.krakow2016.com/api/v2/activities/0565ea98-86bf-4d5f-a3da-3236c8c3a876 -d '{"name": "nazwa", "description": "zmieniony opis"}'
```

**Przykładowa odpowiedź:**  
```json
{
    "status": "success",
    "data": {
        "activity": {
            "created_at": "2016-02-01T22:50:08.906Z",
            "description": "zmieniony opis",
            "id": "0565ea98-86bf-4d5f-a3da-3236c8c3a876",
            "name": "nazwa",
            "updated_at": "2016-02-02T11:47:28.162Z",
            "user_id": "1"
        }
    }
}
```

### Listowanie aktywności

Zwraca listę aktywności wraz z obiektem autora (`id`, `first_name`, `last_name`, `profile_picture_url`). Parametry wyszukiwania należy przekazywać w parametrze `query` w formacie [Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html) (format jest zdefiniowany przez ElasticSearch).

**Ścieżka:**  
```
GET https://wolontariusze.krakow2016.com/api/v2/activities
```

**Przykładowe zapytanie:**  
```
$ curl https://wolontariusze.krakow2016.com/api/v2/activities?query[bool][should][0][term][doc.tags]=kategoria1
```

**Przykładowa odpowiedź:**  
```
{
    "status": "success",
    "data": {
        "activities": [
            {
                "act_type": "dalem_dla_sdm",
                "created_at": "2016-03-28T21:16:52.689Z",
                "created_by": {
                    "id": "2",
                    "first_name": "Karol",
                    "last_name": "Wojty\u0142a",
                    "profile_picture_url": "https://krakow2016.s3.eu-central-1.amazonaws.com/2/avatar?57ae215a9beb713e4475fc9e7623132a\""
                },
                "description": "Tre\u015b\u0107 zadania",
                "duration": "",
                "id": "5102bb7d-651e-49b1-84a9-6f9460287fce",
                "limit": 5,
                "name": "Tytu\u0142 zadania",
                "place": "",
                "volunteers": [
                    "1",
                    "2"
                ],
                "limit_reached": false,
                "datetime": "2016-05-24T21:01:45.489Z",
                "updated_at": "2016-05-24T22:44:09.553Z",
                "tags": [
                    "kategoria1"
                ]
            }
        ]
    }
}
```

### Wysłanie zgłoszenia do aktywności

**Ścieżka:**  
```
POST https://wolontariusze.krakow2016.com/api/v2/activities/:id/join
```

**Przykładowe zapytanie:**  
```
$ curl -X POST https://wolontariusze.krakow2016.com/api/v2/activities/0565ea98-86bf-4d5f-a3da-3236c8c3a876/join
```

**Przykładowa odpowiedź:**  
```json
{
    "status": "success",
    "data": {
        "joint": {
            "activity_id": "0565ea98-86bf-4d5f-a3da-3236c8c3a876",
            "created_at": "2016-02-02T13:05:35.413Z",
            "id": "91186ae2-27f6-4f3b-aadf-4d9570557187",
            "user_id": "1"
        }
    }
}
```

### Cofanie zgłoszenia do aktywności

**Ścieżka:**  
```
POST https://wolontariusze.krakow2016.com/api/v2/activities/:id/leave
```

**Przykładowe zapytanie:**  
```
$ curl -X POST https://wolontariusze.krakow2016.com/api/v2/activities/0565ea98-86bf-4d5f-a3da-3236c8c3a876/leave
```

**Przykładowa odpowiedź:**  
```json
{
    "status": "success",
    "data": {
        "joint": {
            "activity_id": "0565ea98-86bf-4d5f-a3da-3236c8c3a876",
            "created_at": "2016-02-02T13:05:35.413Z",
            "id": "91186ae2-27f6-4f3b-aadf-4d9570557187",
            "is_canceled": true,
            "updated_at": "2016-02-02T13:06:24.705Z",
            "user_id": "1"
        }
    }
}
```

### Usunięcie obiektu aktywności

*Wymagane uprawnienia:* administrator.

**Ścieżka:**  
```
DELETE https://wolontariusze.krakow2016.com/api/v2/activities/:id
```

**Przykładowe zapytanie:**  
```
$ curl -X DELETE https://wolontariusze.krakow2016.com/api/v2/activities/0565ea98-86bf-4d5f-a3da-3236c8c3a876
```

**Przykładowa odpowiedź:**  
```
{
    "status": "success",
    "data": {}
}
```

## Baza noclegowa

Baza noclegowa pielgrzymów składa się listy grup pielgrzymów, do których
przypisane są: opiekun grupy oraz parafia w której znajduje się miejsce
noclegowe wszyskich pielgrzymów należących do danej grupy. Baza danych jest
tylko do odczytu. Przykładu użycia są zawarte w pliku:
<https://github.com/Krakow2016/wolontariusze/blob/master/spec/api_pilgrims_spec.js>.

### Atrybuty

| Identyfikator | Opis                                                             |
| ---           | ---                                                              |
| `id`          | Identyfikator grupy.                                             |
| `guardian`    | Imię i nazwisko opiekuna grupy.                                  |
| `phone`       | Numer telefonu do opiekuna.                                      |
| `location`    | Słowny opis lokalizacji parafii do której przypisana jest grupa. |
| `lat_lon`     | Współrzędne geograficzne miejsca w którym znajduje się parafia.  |

### Pobieranie całej bazy danych

Zwraca najnowszą wersję pełnej bazy danych. To jest: wszystkich grup
pielgrzymów z miejscami noclegowymi. Uwaga: odpowiedź może być duża.

**Ścieżka:**  
```
GET https://wolontariusze.krakow2016.com/api/v2/pilgrims
```

**Przykładowa odpowiedź:**  
```
{
    "status": "success",
    "data": {
        "pilgrims": {
            "created_at": 20160418,
            "data": [
                {
                    "guardian": "Joanna Nowak",
                    "id": "bar",
                    "lat_lon": [
                        0,
                        0
                    ],
                    "location": "parafia \u015bw. Salawy",
                    "phone": "+48111222333"
                }
            ],
            "id": "c19a5c9c-da02-4aeb-b08b-558e83a27cbd"
        }
    }
}
```

### Pobieranie aktualizacji do bazy danych (wersjonowanie)

Zwraca zmiany które nastąpiły od ostatniej aktualizacji (numer wersji należy
podać w parametrze `from`) do dzisiaj (lub do wartości podanej w parametrze
`to`) w formacie JSON w implementacji JSON Patch RFC6902 (implementacja przez
bibliotekę [jiff](https://github.com/cujojs/jiff)).

**Ścieżka:**  
```
GET https://wolontariusze.krakow2016.com/api/v2/pilgrims?from=:from_date&to=:to_date
```

**Przykładowe zapytanie:**  
```
$ curl https://wolontariusze.krakow2016.com/api/v2/pilgrims?from=20160416
```

**Przykładowa odpowiedź:**  
```
{
    "status": "success",
    "data": {
        "patch": [
            {
                "op": "test",
                "path": "/id",
                "value": "eb63b33a-bd8d-4537-8b79-a29744b1f51c"
            },
            {
                "op": "replace",
                "path": "/id",
                "value": "c19a5c9c-da02-4aeb-b08b-558e83a27cbd"
            },
            {
                "op": "add",
                "path": "/data/0",
                "value": {
                    "guardian": "Joanna Nowak",
                    "id": "bar",
                    "lat_lon": [
                        0,
                        0
                    ],
                    "location": "parafia \u015bw. Salawy",
                    "phone": "+48111222333"
                }
            },
            {
                "op": "test",
                "path": "/data/1",
                "value": {
                    "guardian": "Jan Kowalski",
                    "id": "foo",
                    "lat_lon": [
                        0,
                        0
                    ],
                    "location": "parafia \u015bw. Szczepana",
                    "phone": "+48123456789"
                }
            },
            {
                "op": "remove",
                "path": "/data/1"
            },
            {
                "op": "test",
                "path": "/created_at",
                "value": 20160416
            },
            {
                "op": "replace",
                "path": "/created_at",
                "value": 20160418
            }
        ]
    }
}
```
