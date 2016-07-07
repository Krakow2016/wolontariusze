var React = require('react')
var FormattedMessage = require('react-intl').FormattedMessage

module.exports = React.createClass({

  render: function(){
    return (
      <div className="content-texts-container">
        <div className="content-texts">
          <h1 className="text--center"><FormattedMessage id="how_gd" /></h1>
          <p><FormattedMessage id="how_gd_answer" values={{img:''}} /></p>
        </div>
        <img src="/img/texts/how-min.jpg" alt="Jak Działa Góra Dobra?"/>
      </div>
    )
  }
})
