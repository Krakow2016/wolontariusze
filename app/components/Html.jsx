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
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>{this.props.context.getStore(ApplicationStore).getPageTitle()}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
          <link rel="stylesheet" href="/css/pure-min.css" />
          <link rel="stylesheet" href="/css/grids-responsive-min.css" />
          <link rel="stylesheet" href="/css/main.css" />
          <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:400,300,500" />
          <link rel="stylesheet" type="text/css" href="https://rawgit.com/arqex/react-datetime/master/css/react-datetime.css" />
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
          <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
          <script src="/js/client.js"></script>
        </body>
      </html>
    )
  }
})

module.exports = Html
