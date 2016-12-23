var React = require('react')
var FormattedMessage = require('react-intl').FormattedMessage

module.exports = React.createClass({

  render: function(){
    return (
      <div className="content-texts-container">
        <div className="content-texts text--center">
          <h1><FormattedMessage id="what_gd" /></h1>
          <p><FormattedMessage id="what_gd_answer_long" values={{img:''}} /></p>
        </div>
        <img src="/img/texts/what-min.jpg" alt="Czym jest Góra Dobra?"/>
      </div>
    )
  }
})
