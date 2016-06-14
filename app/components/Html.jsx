'use strict'

var React = require('react')

var ApplicationStore = require('../stores/ApplicationStore')

/**
 * React class to handle the rendering of the HTML head section
 *
 * @class Head
 * @constructor
 */
var Html = React.createClass({

  /**
   * Refer to React documentation render
   *
   * @method render
   * @return {Object} HTML head section
   */
  render: function() {
    return (
      <html lang="pl">
        <head>
          <title>Góra Dobra - Portal wolontariuszy ŚDM KRAKÓW 2016. - {this.props.context.getStore(ApplicationStore).getPageTitle()}</title>
          <meta charSet="UTF-8" />

          {/* META TAGS FOR WEB SEO */}
          <meta name="description" content="Góra Dobra to portal dla Wolontariuszy Światowych Dni Młodzieży Kraków 2016 w całości przygotowywany przez nich ..." />

          {/* TWITTER */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@gora_dobra" />
          <meta name="twitter:title" content="Góra Dobra" />
          <meta name="twitter:description" content="Góra Dobra to portal dla Wolontariuszy Światowych Dni Młodzieży Kraków 2016 w całości przygotowywany przez nich ..." />
          <meta name="twitter:image" content="http://wolontariusze.krakow2016.com/img/favicons/apple-icon-120x120.png" />

          {/* FACEBOOK*/}
          <meta property="og:title" content="Góra Dobra" />
          <meta property="og:site_name" content="Góra Dobra dla ŚDM Kraków 2016" />
          <meta property="og:type" content="article" />
          <meta property="og:url" content="http://wolontariusze.krakow2016.com" />
          <meta property="og:image" content="http://wolontariusze.krakow2016.com/img/favicons/ms-icon-310x310.png" />
          <meta property="og:description" content="Góra Dobra to portal dla Wolontariuszy Światowych Dni Młodzieży Kraków 2016 w całości przygotowywany przez nich ..." />

          {/* FAVICONS */}
          <link rel="apple-touch-icon" sizes="57x57" href="/img/favicons/apple-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/img/favicons/apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/img/favicons/apple-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/img/favicons/apple-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/img/favicons/apple-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/img/favicons/apple-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/img/favicons/apple-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/img/favicons/apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/img/favicons/apple-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="192x192"  href="/img/favicons/android-icon-192x192.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/img/favicons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/img/favicons/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/img/favicons/favicon-16x16.png" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="/img/favicons/ms-icon-144x144.png" />
          <meta name="theme-color" content="#ffffff" />

          <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600&subset=latin-ext' rel='stylesheet' type='text/css' />
          <link rel="stylesheet" href="/css/concise.css" />
          <link rel="stylesheet" href="/css/Draft.css" />
          <link rel="stylesheet" href="/css/leaflet.css" />
          <link rel="stylesheet" href="/css/main.css" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

        </head>
        <body>
          <div className="container" id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
          <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
          <script src="/js/client.js"></script>
        </body>
      </html>
    )
  }
})

module.exports = Html
