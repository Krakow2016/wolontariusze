var r = require('rethinkdb')
var request = require('superagent')
var backdraft = require('backdraft-js')
var _ = require('lodash')
var schedule = require('node-schedule')

var env = process.env.NODE_ENV || 'development'
var config = require('./config.json')[env]
// Połączenie z sendgrid daje nam możliwość wysyłania emaili
var sendgrid = require('sendgrid')(process.env.SENDGRID_APIKEY)
var sendgrid_template = process.env.SENDGRID_TEMPLATE
var smtpapi = require('smtpapi')

// Lista zaplanowanych powiadomień o zakończeniu zgłoszeń do zadania
var jobs = {}

var notifyMentioned = function(title, body, author) {
  return function(err, cursor) {
    cursor.toArray(function(err, all) {

      // Anuluj jeżeli nie ma do kogo wysłać
      if(!all.length) { return }

      // Build the smtpapi header
      var header = new smtpapi()
      header.addCategory('mention')
      header.setTos(all.map(function(x){ return x.email }))
      header.addSubstitution(':name', all.map(function(x){ return x.first_name }))
      header.setFilters({
        'templates': {
          'settings': {
            'enable': 1,
            'template_id': sendgrid_template
          }
        }
      })

      var email = new sendgrid.Email({
        to:       'goradobra@krakow2016.com', // Zostanie nadpisane przez nagłówek x-smtpapi
        from:     'goradobra@krakow2016.com',
        fromname: 'Góra Dobra',
        replyto:  author,
        subject:  title,
        html:     body,
        headers:  { 'x-smtpapi': header.jsonString() }
      })

      sendgrid.send(email, function(err, json) {
        console.log('sendgrid:', err, json)
      })
    })
  }
}

r.connect(config.rethinkdb, function(err, conn) {
  r.table('Joints').changes()
    .run(conn, function(err, cursor) {

      cursor.each(function(err, change){ // Nowe zgłoszenie!
        var joint = change.new_val
        // Pobierz aktywność
        r.table('Activities').get(joint.activity_id)
          .run(conn, function(err, activity) {

            r.table('Volunteers').get(joint.created_by)
              .run(conn, function(err, author) { // Pobierz autora zadania

                if(!joint.is_canceled) {
                  var paragraphs = backdraft(activity.description, {
                    'BOLD': ['<strong>', '</strong>'],
                    'ITALIC': ['<i>', '</i>'],
                    'UNDERLINE': ['<u>', '</u>'],
                    'CODE': ['<span style="font-family: monospace">', '</span>']
                  }).join('<br/>')

                  var html = ['<p>:what_happend</p>' + paragraphs]

                  if(activity.updates) {
                    activity.updates.forEach(function(update) { // Dodaje wszystkie aktualizacje
                      //text.push(to_text(update.raw))
                      html.push(backdraft(update.raw, {
                        'BOLD': ['<strong>', '</strong>'],
                        'ITALIC': ['<i>', '</i>'],
                        'UNDERLINE': ['<u>', '</u>'],
                        'CODE': ['<span style="font-family: monospace">', '</span>']
                      }).join('<br/>'))
                    })
                  }

                  // Pobierz wolontariusza który się zgłosił
                  r.table('Volunteers').get(change.new_val.user_id).run(conn, function(err, volunteer) {
                    var email = new sendgrid.Email({
                      to:       volunteer.email,
                      from:     'goradobra@krakow2016.com',
                      fromname: 'Góra Dobra',
                      replyto:  author.email,
                      subject:  'Zadanie: '+ activity.name,
                      html:     html.join('<hr/>')
                    })

                    email.addCategory('join')
                    email.addSubstitution(':name', volunteer.first_name)
                    email.addSubstitution(':what_happend', joint.user_id === joint.created_by ? ':has_joined' : ':was_joined')
                    email.setFilters({
                      'templates': {
                        'settings': {
                          'enable': 1,
                          'template_id': sendgrid_template
                        }
                      }
                    })
                    email.addSection(':has_joined', 'Właśnie przypisałeś/aś się do zadania <a href="'+ config.base_url +'/zadania/'+ activity.id +'">'+ activity.name +'</a> i bierzesz w nim udział. Dziękujemy.')
                    email.addSection(':was_joined', author.first_name +' '+ author.last_name +' - przypisał/a Cię do zadania <a href="'+ config.base_url +'/zadania/'+ activity.id +'">'+ activity.name +'</a>. Prosimy, potwierdź w nim swój udział mailem zwrotnym. Dziękujemy.')

                    sendgrid.send(email, function(err, json) {
                      console.log('sendgrid:', err, json)
                    })
                  })
                }

                // Sprawdź czy nie został osiągnięty limit zgłoszeń
                r.table('Joints')
                  .getAll(activity.id, { index: 'activity_id' })
                  .filter(r.row('is_canceled').eq(true).default(false).not())
                  .count()
                  .run(conn, function(err, count) {
                    var limit = parseInt(activity.limit, 10)
                    if(limit && count === limit) { // Ostatnie zgłoszenie - wyśwli wiadomość autorowi zadania
                      var email = new sendgrid.Email({
                        to:       author.email,
                        from:     'goradobra@krakow2016.com',
                        fromname: 'Góra Dobra',
                        subject:  'Komplet zgłoszeń w zadaniu: '+ activity.name,
                        html:     '<p>Komplet zgłoszeń!</p><p>Gratulacje - do Twojego zadania <a href="'+ config.base_url +'/zadania/'+ activity.id +'">"'+ activity.name +'"</a> właśnie zgłosiła się ostatnia osoba. Teraz możesz być w kontakcie z wszystkimi zgłoszonymi uczestnikami, dodając aktualizacje na stronie zadania. Możesz również zrobić to, wysyłając bezpośrednio do każdego wiadomość drogą mailową.</p>'
                      })

                      email.addCategory('full')
                      email.addSubstitution(':name', author.first_name)
                      email.setFilters({
                        'templates': {
                          'settings': {
                            'enable': 1,
                            'template_id': sendgrid_template
                          }
                        }
                      })

                      sendgrid.send(email, function(err, json) {
                        console.log('sendgrid:', err, json)
                      })
                    }
                  })
              })
          })
      })
    })

  r.table('Activities').changes()
    .filter(
      r.row('new_val').hasFields('updates').and(r.row('new_val')('updates').count().gt(r.row('old_val')('updates').count()).default(true))
    )
    .run(conn, function(err, changes) {
      changes.each(function(err, change){ // Nowa aktualizacja do aktywności

        var activity = change.new_val
        var update = activity.updates.pop()
        var html = '<p>Nastąpiła najnowsza aktualizacja zadania <a href="'+ config.base_url +'/zadania/'+ activity.id +'">'+ activity.name +'</a>, w którym uczestniczysz:</p>'
        html += backdraft(update.raw, {
          'BOLD': ['<strong>', '</strong>'],
          'ITALIC': ['<i>', '</i>'],
          'UNDERLINE': ['<u>', '</u>'],
          'CODE': ['<span style="font-family: monospace">', '</span>']
        }).join('<br/>')

        r.table('Volunteers').get(update.created_by)
          .run(conn, function(err, author) {

            // Wzmianki w aktualizacji
            var entities = update.raw.entityMap || []
            var receivers = _.compact(_.map(entities, function(map) {
              return map.data.mention && map.data.mention.id
            }))

            var body = backdraft(update.raw, {
              'BOLD': ['<strong>', '</strong>'],
              'ITALIC': ['<i>', '</i>'],
              'UNDERLINE': ['<u>', '</u>'],
              'CODE': ['<span style="font-family: monospace">', '</span>']
            }).join('<br/>')

            var title = author.first_name +' '+ author.last_name +' wspomina Cię w zadaniu \"'+ activity.name +'\"'
            var mention_html = '<p>'+ author.first_name +' '+ author.last_name +' wspomnia Cię w aktualizacji do zadania.</p><p>'+ body +'</p><p>Kliknij w poniższy link, aby przejść do zadania: <a href="'+ config.base_url +'/zadania/'+ activity.id +'">'+ activity.name +'</a>.</p>'

            var table = r.table('Volunteers')
            table.getAll.apply(table, receivers) // Pobierz wolontariuszy
              .run(conn, notifyMentioned(title, mention_html, author.email))

            // Powiadom resztę (TODO: usuń wspomnianych)
            r.table('Joints')
              .getAll(change.new_val.id, { index: 'activity_id' })
              .filter(function(x) {
                // Upewnij się że zgłoszenie nie zostało anulowane
                return x.hasFields('is_canceled').not()
              }, { default: true })
              .eqJoin('user_id', r.table('Volunteers'))
              .run(conn, function(err, cursor) {

                cursor.toArray(function(err, volunteers) {
                  if(!volunteers.length) { return } // Nie ma do kogo wysłać
                  // TODO: dodaj autora aktualizacji
                  // Build the smtpapi header
                  var header = new smtpapi()
                  header.addCategory('update')
                  header.setTos(volunteers.map(function(x){ return x.right.email }))
                  header.addSubstitution(':name', volunteers.map(function(x){ return x.right.first_name }))
                  header.setFilters({
                    'templates': {
                      'settings': {
                        'enable': 1,
                        'template_id': sendgrid_template
                      }
                    }
                  })

                  var email = new sendgrid.Email({
                    to:       'goradobra@krakow2016.com', // Zostanie nadpisane przez nagłówek x-smtpapi
                    from:     'goradobra@krakow2016.com',
                    fromname: 'Góra Dobra',
                    replyto:  author.email,
                    subject:  'Zadanie: '+ activity.name,
                    html:     html,
                    headers:  { 'x-smtpapi': header.jsonString() }
                  })

                  sendgrid.send(email, function(err, json) {
                    console.log('sendgrid:', err, json)
                  })
                })
              })
          })
      })
    })

  r.table('Volunteers').changes()
    .filter(r.row('old_val')('approved').default(false).eq(true).not().and(r.row('new_val')('approved').eq(true)))
    .run(conn, function(err, cursor) {
      cursor.each(function(err, change){ // Wolontariusz został "approved"
        var row = change.new_val
        var token = row.access_tokens[row.access_tokens.length-1]
        var url = config.base_url +'/invitation?apikey='+ token.token
        var html = '<p>Chcemy zaprosić Cię do Góry Dobra - portalu dla wolontariuszy, który będzie równocześnie naszą główną platformą komunikacji podczas Światowych Dni Młodzieży w Krakowie oraz narzędziem do organizacji projektów i wydarzeń.</p><p>To tutaj chcemy stworzyć środowisko młodych i zaangażowanych ludzi, dzielić się tym, co robimy i przekazywać Ci ważne informacje o ŚDM i zadaniach, jakie czekają na realizację.</p><p>Dzięki Górze Dobra będziesz mógł pochwalić się efektami swojej pracy. W tym też miejscu będziesz miał możliwość zobaczenia i dzielenia się z innymi informacjami o tym, jak dużo serca, i aktywności wolontariackiej dajesz na rzecz Światowych Dni Młodzieży w Krakowie.</p><p>Aby aktywować swoje konto kliknij w poniższy link:</p><p><a href="'+ url +'">'+ url +'</a></p><p>WAŻNE! Link, jaki otrzymujesz teraz do zalogowania, jest aktywny tylko przez 72h. W wypadku jakichkolwiek problemów bądź pytań, prosimy o kontakt na: goradobra@krakow2016.com.</p><p><b>Uwaga!</b> Zapisując się już dzisiaj masz niepowtarzalną okazję, by wziąć udział w naszej zabawie "Poznajmy się", znajdziesz ją w Banku Pracy po zalogowaniu się: https://wolontariusze.krakow2016.com/zadania/047dffee-9418-447a-a9be-f10174ea9681.</p><p>Nie zwlekaj ani chwili dłużej i zostań już dziś Wolontariuszem ŚDM Kraków 2016.</p>'

        var email = new sendgrid.Email({
          to:       row.email,
          from:     'goradobra@krakow2016.com',
          fromname: 'Góra Dobra',
          subject:  'Zaproszenie do Góry Dobra!',
          html:     html
        })

        email.addCategory('invitation')
        email.addSubstitution(':name', row.first_name)
        email.setFilters({
          'templates': {
            'settings': {
              'enable': 1,
              'template_id': sendgrid_template
            }
          }
        })

        sendgrid.send(email, function(err, json) {
          console.log('sendgrid:', err, json)
        })
      })
    })

  r.table('Volunteers').changes()
    .filter(r.row('old_val')('is_admin').default(false).eq(true).not().and(r.row('new_val')('is_admin').eq(true)))
    .run(conn, function(err, cursor) {
      cursor.each(function(err, change){ // Wolontariusz został adminem
        var row = change.new_val

        r.table('Volunteers').get(row.promoted_by)
          .run(conn, function(err, admin) { // Pobierz autora zmiany

            var html = '<p>'+ admin.first_name +' '+ admin.last_name +' właśnie nadał/a Ci specjalne uprawnienia koordynatora, dzięki którym masz obecnie dostęp do bazy danych wszystkich wolontariuszy w systemie m.in. danych kontaktowych, umiejętności, doświadczenie itp.</p><p> Równocześnie informujemy, że otrzymując dostęp jako koordynator, jesteś zobowiązany/a do zachowania w tajemnicy i nie ujawniania osobom trzecim otrzymanych tu informacji i danych o charakterze poufnym, w tym danych osobowych oraz sposobów ich zabezpieczenia, do których będziesz mieć dostęp w związku z wykonywaniem zadań koordynatora wolontariuszy ŚDM Kraków 2016 zarówno w trakcie ich wykonywania, jak i po ich ustaniu. *<br /> Administratorem powyższych danych jest Archidiecezja Krakowska.</p> <p>* Zgodnie z przepisami Rozdziału 8. Ustawy o ochronie danych osobowych (Dz. U. z 2002 r. Nr 101, poz. 926 ze zm.) w wypadku naruszenia powyższych przepisów ustawy, ponoszona jest odpowiedzialność karna.</p>'

            var email = new sendgrid.Email({
              to:       row.email,
              cc:       'goradobra@krakow2016.com',
              from:     'goradobra@krakow2016.com',
              fromname: 'Góra Dobra',
              subject:  'Witaj w gronie koordynatorów wolontariuszy na Górze Dobra!',
              html:     html
            })

            email.addCategory('admin')
            email.addSubstitution(':name', row.first_name)
            email.setFilters({
              'templates': {
                'settings': {
                  'enable': 1,
                  'template_id': sendgrid_template
                }
              }
            })

            sendgrid.send(email, function(err, json) {
              console.log('sendgrid:', err, json)
            })
          })
      })
    })

  // Wzmianki w komentarzach
  r.table('Comments').filter(r.row.hasFields({
    raw: {
      entityMap: {'0': true} // Tylko te które mają jakąś wzmiankę
    }
  })).changes()
    .run(conn, function(err, cursor){
      cursor.each(function(err, change){ // Nowy komentarz

        var comment = change.new_val
        var table = r.table('Volunteers')

        table.get(comment.adminId)
          .run(conn, function(err, author) { // Pobierz autora komentarza
            table.get(comment.volunteerId)
              .run(conn, function(err, volunteer) { // Pobierz wolontariusza

                // Identyfikatory odbiorców powiadomienia
                var entities = comment.raw.entityMap || []
                var receivers = _.compact(_.map(entities, function(map) {
                  return map.data.mention && map.data.mention.id
                }))
                var title = author.first_name +' '+ author.last_name +' przesyła Ci wiadomość o wolontariuszu'
                var body = '<p>'+ author.first_name +' '+ author.last_name +' wspomnia Cię w komentarzu do profilu wolontariusza.</p><p>Kliknij w poniższy link, aby przejść do profilu: <a href="'+ config.base_url +'/wolontariusz/'+ volunteer.id +'">'+ volunteer.first_name +' '+ volunteer.last_name +'</a>.</p>'

                table.getAll.apply(table, receivers)
                  .filter(r.row('is_admin').eq(true)) // Powiadomienia dostają tylko koordynatorzy!
                  .run(conn, notifyMentioned(title, body, author.email)) // Pobierz wolontariusza
              })
          })
      })
    })

  // Wzmianki w aktywnościach
  r.table('Activities').filter(r.row.hasFields({
    description: {
      entityMap: {'0': true} // Tylko te które mają jakąś wzmiankę
    }
  })).changes().filter(r.row.hasFields('old_val').not()) // Tylko te które zostały właśnie stworzone (a nie edytowane)
    .run(conn, function(err, changes) {
      changes.each(function(err, change){ // Nowy komentarz
        var activity = change.new_val
        var table = r.table('Volunteers')

        table.get(activity.created_by)
          .run(conn, function(err, author) { // Pobierz autora zadania

            // Identyfikatory odbiorców powiadomienia
            var entities = activity.description.entityMap || []
            var receivers = _.compact(_.map(entities, function(map) {
              return map.data.mention && map.data.mention.id
            }))

            table.getAll.apply(table, receivers)
              .run(conn, function(err, cursor) { // Pobierz wolontariuszy
                cursor.toArray(function(err, all) {

                  var body = backdraft(activity.description, {
                    'BOLD': ['<strong>', '</strong>'],
                    'ITALIC': ['<i>', '</i>'],
                    'UNDERLINE': ['<u>', '</u>'],
                    'CODE': ['<span style="font-family: monospace">', '</span>']
                  }).join('<br/>')

                  var html = '<p>'+ author.first_name +' '+ author.last_name +' wspomnia Cię w zadaniu.</p><p>'+ body +'</p><p>Kliknij w poniższy link, aby zobaczyć szczegóły: <a href="'+ config.base_url +'/zadania/'+ activity.id +'">'+ activity.name +'</a>.</p>'

                  // Build the smtpapi header
                  var header = new smtpapi()
                  header.addCategory('mention')
                  header.setTos(all.map(function(x){ return x.email }))
                  header.addSubstitution(':name', all.map(function(x){ return x.first_name }))
                  header.setFilters({
                    'templates': {
                      'settings': {
                        'enable': 1,
                        'template_id': sendgrid_template
                      }
                    }
                  })

                  var email = new sendgrid.Email({
                    to:       'goradobra@krakow2016.com', // Zostanie nadpisane przez nagłówek x-smtpapi
                    from:     'goradobra@krakow2016.com',
                    fromname: 'Góra Dobra',
                    subject:  author.first_name +' '+ author.last_name +' wspomina Cię w zadaniu \"'+ activity.name +'\"',
                    html:     html,
                    headers:  { 'x-smtpapi': header.jsonString() }
                  })

                  sendgrid.send(email, function(err, json) {
                    console.log('sendgrid:', err, json)
                  })
                })
              })
          })
      })
    })

  var notifyEnd = function(activity) {
    r.table('Volunteers').get(activity.created_by)
      .run(conn, function(err, author) {
        var html = '<p>Właśnie upłynął czas zgłaszania się do Twojego zadania <a href="'+ config.base_url +'/zadania/'+ activity.id +'">'+ activity.name +'</a> i nie jest ono już widoczne w banku pracy.</p><p>Nie zapomnij powiadomić zgłoszonych wolontariuszy o szczegółach ich zadań. Możesz zrobić to wysyłając wiadomość  do każdego z osobna lub do wszystkich drogą e-mailową; bądź też poprzez umieszczenie aktualizacji do zadania na Górze Dobra.</p><p>Jeśli nie masz kompletu potrzebnych Ci do zadania osób, możesz przedłużyć czas zgłaszania edytując jego datę.</p>'
        var email = new sendgrid.Email({
          to:       author.email,
          from:     'goradobra@krakow2016.com',
          fromname: 'Góra Dobra',
          subject:  'Upłynął czas zgłoszeń do Twojego zadania!',
          html:     html
        })

        email.addCategory('finish')
        email.addSubstitution(':name', author.first_name)
        email.setFilters({
          'templates': {
            'settings': {
              'enable': 1,
              'template_id': sendgrid_template
            }
          }
        })

        sendgrid.send(email, function(err, json) {
          console.log('sendgrid:', err, json)
        })
      })
  }

  var activities = r.table('Activities')
    .filter(r.row('is_archived').default(false).eq(true).not())
    .filter(r.row('datetime').gt(r.now().toISO8601())) // Tylko przyszłe zadania

  // Wczytaj wszystkie aktywne zadania
  activities
    .run(conn, function(err, cursor) {
      cursor.each(function(err, activity){
        if(!activity.datetime) { return }
        // Dodaj zlecenie wysłania powiadomenia o zakończeniu
        var job = schedule.scheduleJob(new Date(activity.datetime), function(act){
          notifyEnd(act)
        }.bind(null, activity))
        jobs[activity.id] = job
      })
    })

  // Monitoruj zmiany w aktywnych zadaniach
  activities.changes()
    .run(conn, function(err, cursor) {
      cursor.each(function(err, change){
        var activity = change.new_val
        var job = jobs[activity.id]
        if(job) {
          // Usuń lub zaktualizuj zlecenie
          job.cancel()
        }
        // Brak terminu zgłoszeń
        if(!activity.datetime) { return }
        // Dodaj zlecenie wysyłania powiadomienia
        job = schedule.scheduleJob(new Date(activity.datetime), function(act){
          notifyEnd(act)
        }.bind(null, activity))
        jobs[activity.id] = job
      })
    })

  // Informuje API Eventory o zmianach w grupach wolontariusza
  r.table('Volunteers').changes()
    .filter(r.row('new_val')('tags').eq(r.row('old_val')('tags').default([])).not())
    .run(conn, function(err, cursor) {
      cursor.each(function(err, change){
        var row = change.new_val
        request
          .put('http://eventory-beta.coders-mill.com/webapi/v1/sdm/sync')
          .send({volunteer_id: row.id, groups: row.tags})
          .set('X-Operator-Api-Token', process.env.EVENTORY_API)
          .end()
      })
    })

  // Informuje API Eventory o zmianach w zdjęciu profilowym
  r.table('Volunteers').changes()
    .filter(r.row('new_val')('profile_picture_url').eq(r.row('old_val')('profile_picture_url').default('')).not())
    .run(conn, function(err, cursor) {
      cursor.each(function(err, change){
        var row = change.new_val
        request
          .put('http://eventory-beta.coders-mill.com/webapi/v1/sdm/sync')
          .send({
            volunteer_id: row.id,
            photo: row.profile_picture_url
          })
          .set('X-Operator-Api-Token', process.env.EVENTORY_API)
          .end()
      })
    })
})
