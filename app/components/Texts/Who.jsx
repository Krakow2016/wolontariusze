var React = require('react')
var FormattedMessage = require('react-intl').FormattedMessage
var FormattedHTML = require('react-intl').FormattedHTMLMessage

module.exports = React.createClass({

  render: function(){
    return (
      <div className="content-texts-container">
        <div className="content-texts">
          <h1 className="text--center"><FormattedMessage id="who_gd" /></h1>
          <p><FormattedHTML id="who_gd_answer_long" values={{img:''}} /></p>
        </div>
        <img src="/img/texts/who-min.jpg" alt="Kto Jest Zaangażowany?"/>
      </div>
    )
  }
})
