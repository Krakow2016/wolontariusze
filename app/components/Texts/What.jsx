var React = require('react')
var FormattedMessage = require('react-intl').FormattedMessage
var FormattedHTML = require('react-intl').FormattedHTMLMessage

module.exports = React.createClass({

  render: function(){
    return (
      <div className="content-texts-container">
        <div className="content-texts">
          <h1 className="text--center"><FormattedMessage id="what_gd" /></h1>
          <p><FormattedMessage id="what_gd_answer_long" /></p>
        </div>
        <img src="/img/texts/what-min.jpg" alt="Czym jest Góra Dobra?"/>
      </div>
    )
  }
})
