var r = require('rethinkdb')
var request = require('superagent')
var backdraft = require('backdraft-js')

var env = process.env.NODE_ENV || 'development'
var config = require('./config.json')[env]
// Połączenie z sendgrid daje nam możliwość wysyłania emaili
var sendgrid = require('sendgrid')(process.env.SENDGRID_APIKEY)
var sendgrid_template = process.env.SENDGRID_TEMPLATE

var to_text = function(state) {
  return state.blocks.map(function(block) {
    return block.text
  }).join('\n')
}

r.connect(config.rethinkdb, function(err, conn) {
  r.table('Joints').changes().filter(r.row.hasFields('old_val').not())
    .run(conn, function(err, cursor) {

    cursor.each(function(err, change){ // Nowe zgłoszenie!
      var joint = change.new_val
      // Pobierz aktywność
      r.table('Activities').get(joint.activity_id)
        .run(conn, function(err, activity) {

        r.table('Volunteers').get(joint.created_by)
          .run(conn, function(err, author) { // Pobierz autora zadania

          //var text = [to_text(activity.description)]
          var paragraphs = backdraft(activity.description, {
            'BOLD': ['<strong>', '</strong>'],
            'ITALIC': ['<i>', '</i>'],
            'UNDERLINE': ['<u>', '</u>'],
            'CODE': ['<span style="font-family: monospace">', '</span>'],
          }).join('<br/>')

          var html = ['<p>:what_happend</p>' + paragraphs]

          if(activity.updates) {
            activity.updates.forEach(function(update) { // Dodaje wszystkie aktualizacje
              //text.push(to_text(update.raw))
              html.push(backdraft(update.raw, {
                'BOLD': ['<strong>', '</strong>'],
                'ITALIC': ['<i>', '</i>'],
                'UNDERLINE': ['<u>', '</u>'],
                'CODE': ['<span style="font-family: monospace">', '</span>'],
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
              //text:     text.join('\n\n***\n\n'),
              html:     html.join('<hr/>')
            })

            email.addSubstitution(':name', volunteer.first_name)
            email.addSubstitution(':what_happend', joint.user_id === joint.created_by ? ':has_joined' : ':was_joined')
            email.setFilters({
              'templates': {
                'settings': {
                  'enable': 1,
                  'template_id': sendgrid_template,
                }
              }
            })
            email.addSection(':has_joined', 'Właśnie przypisałeś/aś się do zadania <a href="https://wolontariusze.krakow2016.com/zadania/'+ activity.id +'">'+ activity.name +'</a> i bierzesz w nim udział. Dziękujemy.')
            email.addSection(':was_joined', author.first_name +' '+ author.last_name +' - przypisał/a Cię do zadania <a href="https://wolontariusze.krakow2016.com/zadania/'+ activity.id +'">'+ activity.name +'</a>. Prosimy, potwierdź w nim swój udział mailem zwrotnym. Dziękujemy.')

            sendgrid.send(email, function(err, json) {
              console.log('sendgrid:', err, json)
            })
          })
        })
      })
    })
  })

  r.table('Activities').changes()
    .filter(
      r.row('new_val').hasFields('updates').and(r.row('new_val')('updates').count().gt(r.row('old_val')('updates').count()).default(true))
    )
    .run(conn, function(err, cursor) {
      cursor.each(function(err, change){ // Nowa aktualizacja do aktywności

        var activity = change.new_val
        var update = activity.updates.pop()
        var title = activity.name
        var html = '<p>Nastąpiła najnowsza aktualizacja zadania <a href="https://wolontariusze.krakow2016.com/zadania/'+ activity.id +'">'+ title +'</a>, w którym uczestniczysz:</p>'
        html += backdraft(update.raw, {
          'BOLD': ['<strong>', '</strong>'],
          'ITALIC': ['<i>', '</i>'],
          'UNDERLINE': ['<u>', '</u>'],
          'CODE': ['<span style="font-family: monospace">', '</span>'],
        }).join('<br/>')

        r.table('Joints')
          .getAll(change.new_val.id, { index: 'activity_id' })
          .filter(function(x) {
            return x.hasFields('is_canceled').not()
          }, { default: true })
          .eqJoin('user_id', r.table('Volunteers'))
          .run(conn, function(err, cursor) {

          r.table('Volunteers').get(change.new_val.created_by)
            .run(conn, function(err, author) {

            cursor.toArray(function(err, volunteers) {
              // TODO: dodaj autora aktywności
              volunteers.forEach(function(volunteer) {
                // Upewnij się że zgłoszenie nie zostało anulowane
                if(volunteer.left.is_canceled === true) { return }

                var to = volunteer.right.email
                var email = new sendgrid.Email({
                  to:       to,
                  from:     'goradobra@krakow2016.com',
                  fromname: 'Góra Dobra',
                  replyto:  author.email,
                  subject:  'Zadanie: '+ title,
                  html:     html
                })

                email.addSubstitution(':name', volunteer.right.first_name)
                email.setFilters({
                  'templates': {
                    'settings': {
                      'enable': 1,
                      'template_id': sendgrid_template,
                    }
                  }
                })

                sendgrid.send(email, function(err, json) {
                  console.log('sendgrid:', err, json)
                })
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
        var url = '/invitation?apikey='+ token.token
        var html = '<p>Chcemy zaprosić Cię do Góry Dobra - portalu dla wolontariuszy, który będzie równocześnie naszą główną platformą komunikacji podczas Światowych Dni Młodzieży w Krakowie oraz narzędziem do organizacji projektów i wydarzeń.</p><p>To tutaj chcemy stworzyć środowisko młodych i zaangażowanych ludzi, dzielić się tym, co robimy i przekazywać Ci ważne informacje o ŚDM i zadaniach, jakie czekają na realizację.</p><p>Dzięki Górze Dobra będziesz mógł pochwalić się efektami swojej pracy. W tym też miejscu będziesz miał możliwość zobaczenia i dzielenia się z innymi informacjami o tym, jak dużo serca, i aktywności wolontariackiej dajesz na rzecz Światowych Dni Młodzieży w Krakowie.</p><p>Aby aktywować swoje konto kliknij w poniższy link:</p><p>https://wolontariusze.krakow2016.com'+ url +'</p><p>WAŻNE! Link, jaki otrzymujesz teraz do zalogowania, jest aktywny tylko przez 72h. W wypadku jakichkolwiek problemów bądź pytań, prosimy o kontakt na: goradobra@krakow2016.com.</p><p>Nie zwlekaj ani chwili dłużej i zostań już dziś Wolontariuszem ŚDM Kraków 2016.</p>'

        var email = new sendgrid.Email({
          to:       row.email,
          from:     'goradobra@krakow2016.com',
          fromname: 'Góra Dobra',
          subject:  'Zaproszenie do Góry Dobra!',
          html:     html
        })

        email.addSubstitution(':name', row.first_name)
        email.setFilters({
          'templates': {
            'settings': {
              'enable': 1,
              'template_id': sendgrid_template,
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
            bcc:      'goradobra@krakow2016.com',
            from:     'goradobra@krakow2016.com',
            fromname: 'Góra Dobra',
            subject:  'Witaj w gronie koordynatorów wolontariuszy na Górze Dobra!',
            html:     html
          })

          email.addSubstitution(':name', row.first_name)
          email.setFilters({
            'templates': {
              'settings': {
                'enable': 1,
                'template_id': sendgrid_template,
              }
            }
          })

          sendgrid.send(email, function(err, json) {
            console.log('sendgrid:', err, json)
          })
        })
      })
    })

  // Informuje API Eventory o zmianach w grupach wolontariusza
  r.table('Volunteers').changes()
    .filter(r.row('new_val')('tags').eq(r.row('old_val')('tags')).not())
    .run(conn, function(err, cursor) {
      cursor.each(function(err, change){
        var row = change.new_val
        request
          .put('http://eventory-beta.coders-mill.com/webapi/v1/sdm/sync')
          .send({volunteer_id: row.id, groups: row.tags})
          .set('X-Operator-Api-Token', process.env.EVENTORY_API)
          .end(function(err, resp){
            //console.log(err, resp)
          })
      })
    })
})
