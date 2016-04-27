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
