'use strict'

var express = require('express'),
	handlebars  = require('express-handlebars'),
	path = require('path'),
	bodyParser = require('body-parser'),
	React = require('react'),
	ReactDOMServer = require('react-dom/server'),
	serialize = require('serialize-javascript'),
	navigateAction = require('fluxible-router').navigateAction,
	passport = require('passport'),
	LocalAPIKeyStrategy = require('passport-localapikey-update').Strategy,
	session = require('express-session'),
	flash = require('connect-flash'),
	request = require('request'),
	crypto = require('crypto'),
	multipart = require('connect-multiparty'),
	excelParser = require('excel-parser'),
	AWS = require('aws-sdk'),
	async = require('async'),
	sharp = require('sharp'),
	ua = require('universal-analytics'),
	fs = require('fs')

// Służy do zapisywania sesji użytkowników w bazie danych
var RDBStore = require('session-rethinkdb')(session)

// Wyświetlanie komunikatów kontrolnych
var debug = require('debug')('Server')
var env = process.env.NODE_ENV || 'development'
var config = require('./config.json')[env]

// Konfiguracja bazy danych
var r = require('rethinkdbdash')({
	servers: [ config.rethinkdb ]
})

require('node-jsx').install({extension: '.jsx'})
var HtmlComponent = React.createFactory(require('./app/components/Html.jsx'))

// Źródło danych - obiekt udostępniający metody dostępu do danych wolontariuszy
// (CRUD). Zamień w ścieżkach pliku `static` na `rethinkdb` aby podłączyć się
// pod lokalną bazę danych.
var Activities = require('./app/services/activities')(config.service)
var ActivitiesES = require('./app/services/es/activities')
var Comments = require('./app/services/'+config.service+'/comments')
var Volunteers = require('./app/services/volunteers')(config.service)
var Integration = require('./app/services/'+config.service+'/integrations')
var APIClient = require('./app/services/'+config.service+'/apiclients')
var Joints = require('./app/services/joints')(config.service)
var Xls = require('./app/services/'+config.service+'/xls')

var app = require('./app/fluxible')
// Get access to the fetchr plugin instance
var fetchrPlugin = app.getPlugin('FetchrPlugin')

// Get information from html forms
var jsonParser = bodyParser.json()
// Parse the URL-encoded data with qs library
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var approve = function(user, cb) {
	// Generuje losowy token dostępu
	crypto.randomBytes(32, function(ex, buf) {
		var tokens = user.access_tokens || []
		// Token przekształcony do formatu szesnastkowego
		var token = buf.toString('hex')
		tokens.push({
			token: token,
			// Data potrzebna do późniejszego sprawdzenia ważności tokenu
			generated_at: new Date()
			// Data użycia (token jest jednorazowy)
			//used_at: null,
			// IP komputera z którego nastąpiło zalogowanie
			//used_by: null
		})

		cb({
			approved: true,
			access_tokens: tokens
		})
	})
}

var admin = {
	user: { id: '', is_admin: true }
}

// Konfiguracja middleware-u Passport definująca metodę weryfikacji poprawności
// logowania.
require('./auth')

// Logowanie za pomocą jednorazowego tokena
passport.use(new LocalAPIKeyStrategy({passReqToCallback: true},
	function(req, apikey, done) {
		// Znajdź konto na które podany token został wygenerowany
		Volunteers.read(admin, 'Volunteers', { key: apikey }, { index: 'token' }, function (err, users) {
			var user = users[0]
			if (err) { return done(err) } // Błąd bazy danych
			if (!user) {
				return done(null, false)
			} else {
				var token
				var tokens = user.access_tokens || []
				var length = tokens.length
				for (var i=0; i<length; i++) {
					var value = tokens[i]
					if (value.token === apikey) {
						token = value
					}
				}

				if(!token) { return done(500) } // Brak tokena - nie powinno się zdarzyć
				var expiration_date = token.generated_at + 72*60*60*1000 // +72h

				if(token.used) { // Sprawdź czy token nie został już użyty
					return done(null, false, {
						message: 'message_used_token'
					})
				} else if(new Date() > expiration_date) { // Sprawdź czy token nie wygasł
					return done(null, false, {
						message: 'message_old_token'
					})
				} else { // Autoryzacja przebiegła pomyślnie
					token.used = { datetime: new Date(), ip: req.ip, headers: req.headers }
					Volunteers.update(admin, 'Volunteers', {id: user.id}, {
						access_tokens: tokens
					}, {}, function (err) {
						if(err) {
							return done(500) // Błąd bazy danych
						}
						return done(null, user)
					})
				}
			}
		})
	}
))

module.exports = function(server) {

	// Serwuj wszystkie pliki w katalogu public/ jako zwykłe pliki statyczne.
	server.use(express.static(path.join(__dirname, 'public')))

	server.use(function(req, res, next){
		// Zapamiętaj w tablicy plik vendor.js do dołączenia jako skrypt na każdej
		// stronie serwowanej klientowi.
		res.locals.scripts = ['/js/vendor.js']
		next()
	})

	server.use(session({
		secret: 'secret',
		store: config.service === 'rethinkdb' ? new RDBStore(r) : new session.MemoryStore()
	}))
	// Middleware służący do wyświetlania komunikatów flash
	server.use(flash())
	// Przepujść każde zapytanie przez middleware do autoryzacji Passport.
	server.use(passport.initialize())
	// Przechowywuj sesje użytkownika w pamięci serwera.
	server.use(passport.session())
	// Google Analytics Measurement Protocol
	server.use(function(req, res, next) {
		req.visitor = ua(process.env.GOOGLE_ANALYTICS_UID, req.user && req.user.id)
		next()
	})

	// Użyj silnika szablonów Handlebars
	server.engine('handlebars', handlebars({
		defaultLayout: 'main'
	}))
	server.set('view engine', 'handlebars')

	if(fetchrPlugin) {
		// Register our messages REST services
		fetchrPlugin.registerService(Volunteers)
		fetchrPlugin.registerService(Activities)
		fetchrPlugin.registerService(ActivitiesES)
		fetchrPlugin.registerService(Comments)
		fetchrPlugin.registerService(Integration)
		fetchrPlugin.registerService(APIClient)
		fetchrPlugin.registerService(Joints)
		fetchrPlugin.registerService(Xls)
		// Set up the fetchr middleware
		server.use(fetchrPlugin.getXhrPath(), jsonParser, function(req, res, done) {
			// Google Analytics Measurement Protocol
			if(req.visitor) {
				req.visitor.pageview({
					dp: req.path,
					dh: 'https://goradobra.pl',
					dr: req.headers['referer'],
					uip: req.headers['x-real-ip'],
					ua: req.headers['user-agent']
				}).send()
			}
			done()
		}, fetchrPlugin.getMiddleware())
	}

  server.get('/rodo', urlencodedParser, (req, res) => {
    let rodo = {
      date: Date.now(),
      token: req.query,
      ip: req.connection.remoteAddress,
      headers: req.headers
    }
    r.table('Rodo').insert(rodo).run()
      .then((result) => {
        res.redirect('https://goradobra.pl/regulamin')
      })
  })

	// W pierwszej kolejności sprawdź ścieżki z poza single-page
	// application
	server.post('/login', jsonParser, urlencodedParser, function (req, res, next) {

			var redirect_url = "/"
			if (req.body.redirect_url) {
				redirect_url=req.body.redirect_url
			}

			var modified_login_url = "/"
			if (req.body.modified_login_url) {
				modified_login_url=req.body.modified_login_url
			}

			passport.authenticate('local', {
				successReturnToOrRedirect: redirect_url,
				failureRedirect: modified_login_url,
				failureFlash: true,
				successFlash: true
			})(req, res, next)
		}
	)

	server.get('/new', function(req, res){
		res.sendFile(path.join(__dirname, "public/static/new.html"))
	})
	server.get('/nowa', function(req, res){
		res.sendFile(path.join(__dirname, "public/static/nowa.html"))
	})

	server.get('/logout', function(req, res){
		req.logout()
		req.flash('success', 'message_logged_out')
		res.redirect('/')
	})



	// Zamienia nazwę użytkownika na id i zapisuje w bazie
	server.post('/instagram', jsonParser, function(req, res){
		if(req.body.username) {
			request({
				method: 'GET',
				url: 'https://api.instagram.com/v1/users/search?q='+ req.body.username +'&access_token=' + process.env.INSTAGRAM_TOKEN
			}, function(err, resp, body) {

				if (err || resp.statusCode !== 200) {
					return res.status(500).send({'status': 'error'})
				}

				var json = JSON.parse(body).data[0]
				if (!json) {
					// Niepoprawny login
					res.status(404).send({status: 'not_found'})
					return
				}

				var instagram = {
					instagram: {
						id: json.id,
						username: json.username
					}
				}
				Volunteers.update(req, 'Volunteers', {id: req.user.id}, instagram, {}, function(err){
					if(err) { return res.status(500) }
					return res.send({
						'status': 'ok',
						'result': instagram.instagram
					})
				})
			})
		} else {
			res.status(403).send({
				status: 'error'
			})
		}
	})

	server.get('/instagram/all', function(req, res){
		request({
			url: 'https://api.instagram.com/v1/tags/krakow2016/media/recent?access_token='+ process.env.INSTAGRAM_TOKEN+'&count=8',
			json: true
		}, function(err, req, resp){
			res.send(resp)
		})
	})

	server.get('/instagram/:id', function(req, res){
		var id = req.params.id
		var tags = ['krakow2016', 'wyd2016', 'sdm2016', 'jmj2016', 'gmg2016', 'сдм2016', 'wjt2016', 'вдм2016']

		Volunteers.read(admin, 'Volunteers', {id: id}, {}, function (err, user) {
			var instagram = user.instagram

			if(err) { return res.send(500) }
			if(!instagram) { return res.send(404) }

			request({
				url: 'https://api.instagram.com/v1/users/'+ instagram.id +'/media/recent/?access_token='+ process.env.INSTAGRAM_TOKEN,
				json: true
			}, function(err, req, data) {
				var resp_tags = {data: []}

				if(err) {
					// Brak lub źle podpięta integracja
					return res.send(404)
				}

				for(var img in data.data){
					for(var tag in data.data[img].tags){
						if(tags.indexOf(data.data[img].tags[tag]) != -1){
							resp_tags.data.push(data.data[img])
							break
						}
					}
				}
				res.send(resp_tags)
			})

		})
	})

	server.post('/search', function(req, res) {
		if(req.user && req.user.is_admin) {
			var elasticSearch = config.elasticSearch +'/_search'
			req.pipe(request(elasticSearch))
				.on('error', function(e){
					console.error(e)
					res.send(500) // Brak połączenia z bazą
				}).pipe(res)
		} else {
			res.status(403).send({
				status: 'error'
			})
		}
	})

	server.post('/suggest', function(req, res) {
		if(req.user) {
			var elasticSearch = config.elasticSearch +'/_suggest'
			req.pipe(request(elasticSearch))
				.on('error', function(e) {
					console.error(e)
					res.send(500) // Brak połączenia z bazą
				}).pipe(res)
		} else {
			res.status(403).send({
				status: 'error'
			})
		}
	})

	server.post('/removeVolunteerData', jsonParser, function(req, res) {
		var payload = req.body
		if(req.user && req.user.is_admin) {
			r.table('Volunteers').get(payload.id).replace(function (vol) {
				return vol.pluck("id", "first_name", "last_name")
			}).run().then(function(result) {
				console.log('After trying to reduce voluteer data to id, first_name, last_name:', result)
				result.deleted_by = req.user.id
				return r.table('Volunteers').get(payload.id).update({deleted_by: result.deleted_by}).run()
			}).then(function (result) {
				console.log('After trying to add deleted_by:', result)
				return r.table('session').filter({session: { passport: { user: payload.id } } }).delete().run()
			}).then(function (result) {
				console.log('After trying to remove data from sessions:', result)
				return r.table('Imports').getAll(payload.email.toString(), {index: 'rg_email'}).delete().run()
			}).then (function (result) {
				console.log('After trying to remove data from Imports table:', result)
				var elasticSearch = config.elasticSearch +'/volunteer/'+payload.email
				request({method: 'DELETE', url: elasticSearch, timeout: 3000}, function (error, response, body) {
					console.log('After trying to remove data from Elastic Search:', body)
					if (error) {
						console.log(error)
						res.send(500)
					} else {
						res.send(200)
					}
				})
			}).catch(function (error) {
				console.log('CATCH removeVolunteerData', error)
			})
		} else {
			res.status(403).send({
				status: 'error'
			})
		}
	})

	server.get('/invitation', passport.authenticate('localapikey', {
		successRedirect: '/witaj',
		failureRedirect: '/login',
		failureFlash: true,
		successFlash: true
	}))

	server.post('/invitation', jsonParser, function(req, res) {
		var id = req.body.id
		if(req.user && req.user.is_admin) {
			Volunteers.read(req, 'Volunteers', {id: id}, {}, function (err, user) {
				if(err) {
					return res.status(500).send(err)
				}

				approve(user, function(update) {
					// Zapisz w token w bazie
					Volunteers.update(req, 'Volunteers', {
						id: id
					}, update, {}, function (err) {
						if(err) {
							res.status(500).send(err)
						} else {
							res.send({'status': 'success'})
						}
					})
				})
			})
		} else {
			res.status(403).send({
				status: 'error'
			})
		}
	})

	// Zwraca listę unikalnych tagów przypisanych do wolontariuszy
	server.get('/tags', function(req, res) {
		r.table('Volunteers').map(function(vol) {
			return vol('tags').default([])
		}).union(r.table('Activities').map(function(act) {
			return act('tags').default([])
		})).reduce(function(left, right) {
			return left.union(right)
		}).distinct().run().then(function(result) {
			res.send(result)
		})
	})

	server.get('/stats', function(req, res) {
		var result = {}
		var stats = [
			// Liczba użytkowników który mogą się zalogować do systemu
			function(cb) {
				r.table('Volunteers').count(function(volunteer) {
					return volunteer.hasFields('password')
				}).run().then(function(count) {
					result.total_active = count
					cb()
				})
			},
			// Liczba wykonanych zadań
			function(cb) {
				r.table('Activities').count(function(activity) {
					return activity('is_archived').default(false).eq(true)
				}).run().then(function(count) {
					result.total_archived = count
					cb()
				})
			}
		]

		if(req.user && req.user.is_admin) {
			stats = stats.concat([
				function(cb){
					r.table('Volunteers').count().run().then(function(count) {
						// Liczba wszystkich kont w systemie
						result.total_accounts = count
						cb()
					})
				}, function(cb) {
					r.table('Imports').count().run().then(function(count) {
						// Liczba wolontariuszy importowanych z bazy watykańskiej
						result.total_volunteers = count
						cb()
					})
				}, function(cb) {
					r.table('Volunteers')('is_admin').count(true).run().then(function(count) {
						// Liczba administratorów
						result.total_admins = count
						cb()
					})
				}
			])
		}

		async.parallel(stats, function(err) {
			if(err) {
				res.send(500)
			} else {
				res.send(result)
			}
		})
	})

	// Wysyła link aktywacyjny do nieaktywnych krótkoterminowych wolontariuszy
	server.post('/register', jsonParser, function(req, res){
		var ok = function(user, res) {
			approve(user, function(update) {
				// Zapisz w token w bazie
				Volunteers.update(admin, 'Volunteers', {
					id: user.id
				}, update, {}, function (err) {
					if(err) {
						res.status(500).send(err)
					} else {
						res.status(200).send({
							status: 'ok',
							message: 'message_thank_you'
						})
					}
				})
			})
		}

		var email = req.body.email
		if(email) {
			// Znajdź konto o podanym adresie email
			Volunteers.read(admin, 'Volunteers', { key: email }, { index: 'email' }, function (err, users) {
				if (err || !users) { return res.status(500).send(err) } // Błąd bazy danych
				var user = users[0]
				if (!user) {
					return res.status(400).send({
						status: 'error',
						message: 'message_no_mail'
					})
				} else if (user.password) {
					return res.status(400).send({
						status: 'error',
						message: 'message_not_active'
					})
				} else if (user.approved) {
					// Zablokuj i odblokuj konto
					Volunteers.update(admin, 'Volunteers', {
						id: user.id
					}, { approved: false }, {}, function (err) {
						return ok(user, res)
					})
				} else {
					Xls.read(admin, 'Imports', { email: email }, { index: 'rg_email' }, function (err2, importedUser) {
						if (!importedUser) {
							return res.status(400).send({
								status: 'error',
								message: 'message_no_application'
							})
						} else {
							ok(user, res)
						}
					})
				}
			})
			// Zapisz adres email
			fs.appendFile('registrations.log', email +', '+ JSON.stringify(req.headers) +'\n')
		} else {
			res.status(403).send({
				status: 'error'
			})
		}
	})

	var multipartMiddleware = multipart()
	server.post('/import', multipartMiddleware, function(req, res) {
		if(req.user && req.user.is_admin) {
			// Parsuje plik xml do formatu json
			excelParser.parse({
				inFile: req.files.image.path, // TODO: co jeżeli > 1?
				worksheet: 'Volunteers'
			}, function(err, records){
				if(err) {
					res.status(500).send(err)
					//console.error(err)
					return
				}

				// Dokumenty do zapisu w bazie ElasticSearch
				var docs = []
				// Dokumenty do zapisu w bazie RethinkDB
				var volunteers = {}
				// Tablica emaili niezbędna do wykluczenia powtarzających się adresów
				// email
				var emails = []
				// Pierwszy wiersz jest tablicą atrybutów
				var keys = records.shift()

				records.forEach(function(record){
					var map = {}
					// Na potrzeby wyszukiwarki indeksujemy w ElasticSearch wszystkie
					// informacje które posiadamy.
					keys.forEach(function(key, i) {
						map[key.toLowerCase()] = record[i]
					})
					docs.push(map)
					emails.push(map['rg_email'])

					// W bazie zapisujemy tylko ustalone wcześniej podstawowe informacje
					volunteers[map['rg_email']] = {
						email: map['rg_email'],
						first_name: map['rg_firstname'],
						last_name: map['rg_lastname'],
						nationality: map['rg_nationality'],
						languages: map['od_languages'].split('|')
					}
				})

				// Dane do ElasticSearcha najpierw lądują w tabeli `Imports` żeby
				// później zostać automatycznie przeniesione i zcalone z odpowiadającym
				// im dokumentem wolontariusza poprzez narzędzie LogStash.
				r.table('Imports').insert(docs, {
					conflict: 'replace'
				}).run().then(function() {
					var table = r.table('Volunteers')
					emails.push({index: 'email'})
					// Pobierz wszystkie duplikaty
					table.getAll.apply(table, emails).run().then(function(result) {
						var docs = []
						// Usuń duplikaty
						result.forEach(function(volunteer) {
							delete volunteers[volunteer.email]
						})
						// Przekonwertuj obiekt na tablicę
						Object.keys(volunteers).forEach(function(key) {
							docs.push(volunteers[key])
						})
						// Zapisz nieistniejących wolontariuszy w bazie danych
						r.table('Volunteers').insert(docs).run().then(function(result) {
							res.send(result)
						})
					})
				})
			})
		}
	})

	AWS.config.update({region: config.s3.region})
	server.post('/upload', multipartMiddleware, function(req, res) {
		if(req.user) {
			async.parallel([
				function(cb){
					// Zdjęcie profilowe @x2 - przytnij i wyślij do S3
					sharp(req.files.avatar.path)
						.resize(750, 750)
						.quality(90)
						.toBuffer(function(err, buffer) {
							if(err) { return cb(err) }
							var s3obj = new AWS.S3({
								params: {
									Bucket: config.s3.bucket,
									Key: req.user.id +'/avatar@x2' }
							})
							// pipe to s3
							s3obj.upload({Body: buffer})
								.send(cb)
						})
				}, function(cb){
					// Zdjęcie profilowe - przytnij i wyślij do S3
					sharp(req.files.avatar.path)
						.resize(375, 375)
						.quality(90)
						.toBuffer(function(err, buffer) {
							if(err) { return cb(err) }
							var s3obj = new AWS.S3({
								params: {
									Bucket: config.s3.bucket,
									Key: req.user.id +'/avatar' }
							})
							// pipe to s3
							s3obj.upload({Body: buffer})
								.send(cb)
						})
				}, function(cb) {
					// Miniaturka - przytnij i wyślij do S3
					sharp(req.files.avatar.path)
						.resize(100, 100)
						.quality(75)
						.toBuffer(function(err, buffer) {
							if(err) { return cb(err) }
							var s3obj = new AWS.S3({
								params: {
									Bucket: config.s3.bucket,
									Key: req.user.id +'/thumb' }
							})
							s3obj.upload({Body: buffer})
								.send(cb)
						})
				}
			], function(err, data) {
				if(err) {
					res.status(500).send(err)
				} else {
					var reg = new RegExp('\"', 'g')
					var changes = {
						profile_picture_url: data[1].Location +'?'+ data[0].ETag.replace(reg, ''),
						thumb_picture_url: data[2].Location +'?'+ data[1].ETag.replace(reg, '')
					}
					Volunteers.update(admin, 'Volunteers', {id: req.user.id}, changes, {returnChanges: true}, function(err, result) {
						if(err) {
							res.status(500).send('Wystąpił nieznany błąd bazy danych.')
							console.error(err)
						} else {
							var changes = result.changes[0]
							res.status(201).send(changes && changes.new_val)
						}
					})
				}
			})
		} else {
			res.status(403).send({
				status: 'error'
			})
		}
	})

	// Zwraca stronę aplikacji
	server.use(function(req, res, next) {
		// material-ui wymaga tej zmiennej globalnej
		GLOBAL.navigator = {userAgent: req.headers['user-agent']}
		// Dołącz obiekt zalogowanego użytkownika do kontekstu (stanu) zapytania,
		// który zostanie przekazay do klienta (przeglądarki).
		var context = app.createContext({
			req: req,
			user: req.user
		})

		// Przekaż do aplikacji wiadomości flash (pochodzące z serwera)
		var success = req.flash('success')[0]
		var failure = req.flash('error')[0]
		if(success) { // Sukces
			context.getActionContext().dispatch('SAVE_FLASH_SUCCESS', success)
		} else if(failure) { // Błąd
			context.getActionContext().dispatch('SAVE_FLASH_FAILURE', failure)
		}


		// Ustaw język
		var cookies = parseCookies(req)
		context.getActionContext().dispatch('SET_LANGUAGE', typeof cookies != "undefined" && typeof cookies.lang != "undefined" ?  cookies.lang : req.headers['accept-language'])

		// Google Analytics Measurement Protocol
		if(req.visitor) {
			req.visitor.pageview({
				dp: req.path,
				dh: 'https://goradobra.pl',
				dr: req.headers['referer'],
				uip: req.headers['x-real-ip'],
				ua: req.headers['user-agent']
			}).send()
		}

		debug('Executing navigate action')
		context.executeAction(navigateAction, {
			url: req.url
		}, function (err) {
			if (err) {
				debug('There was an error: '+ JSON.stringify(err))
				if (err.status && err.status === 404) {
					next()
				} else {
					next(err)
				}
				return
			}

			debug('Exposing context state')
			var exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';'

			debug('Rendering Application component into html')
			var Component = app.getComponent()

			var html = ReactDOMServer.renderToStaticMarkup(HtmlComponent({
				state: exposed,
				markup: ReactDOMServer.renderToString(Component({
					context: context.getComponentContext()
				})),
				context: context.getComponentContext(),
				script: app.script
			}))

			debug('Sending markup')
			res.send(html)
		})
	})

	function parseCookies (request) {
		var list = {},
			rc = request.headers.cookie;

		rc && rc.split(';').forEach(function( cookie ) {
			var parts = cookie.split('=');
			list[parts.shift().trim()] = decodeURI(parts.join('='));
		});

		return list;
	}

	return server
}
