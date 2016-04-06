var r = require('rethinkdb')
var request = require('superagent')
var backdraft = require('backdraft-js')

var env = process.env.NODE_ENV || 'development'
var config = require('./config.json')[env]
// Połączenie z sendgrid daje nam możliwość wysyłania emaili
var sendgrid = require('sendgrid')(process.env.SENDGRID_APIKEY)

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
                  'template_id' : 'b716bb89-8416-4a44-a59f-edce76134f66',
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
                      'template_id' : 'b716bb89-8416-4a44-a59f-edce76134f66',
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

  // Informuje API Eventory o zmianach w grupach wolontariusza
  r.table('Volunteers').changes()
    .filter( r.row('new_val')('tags').eq(r.row('old_val')('tags')).not())
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
