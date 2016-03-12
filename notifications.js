var r = require('rethinkdb')
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

    cursor.each(function(err, change){
      console.log('Nowe zgłoszenie!')
      r.table('Activities').get(change.new_val.activity_id).run(conn, function(err, activity) {
        var text = to_text(activity.description)

        r.table('Volunteers').get(change.new_val.user_id).run(conn, function(err, volunteer) {
          var email = new sendgrid.Email({
            to:       volunteer.email,
            from:     'wolontariat@krakow2016.com',
            fromname: 'Góra Dobra',
            subject:  'Zadanie: '+ activity.name,
            text:     text
          })
          sendgrid.send(email, function(err, json) {
            console.log('sendgrid:', err, json)
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
      cursor.each(function(err, change){
        console.log('Nowa aktualizacja do aktywności')

        var update = change.new_val.updates.pop()
        var title = change.new_val.name
        var text = to_text(update.raw)

        r.table('Joints')
          .getAll(change.new_val.id, { index: 'activity_id' })
          .filter(function(x) {
            return x.hasFields('is_canceled').not()
          }, { default: true })
          .eqJoin('user_id', r.table('Volunteers'))
          .run(conn, function(err, cursor) {

          cursor.toArray(function(err, volunteers) {

            volunteers.forEach(function(volunteer) {
              var to = volunteer.right.email
              var email = new sendgrid.Email({
                to:       to,
                from:     'wolontariat@krakow2016.com',
                fromname: 'Góra Dobra',
                subject:  'Zadanie: '+ title,
                text:     text
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
