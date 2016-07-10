var React = require('react')
var FormattedHTMLMessage = require('react-intl').FormattedHTMLMessage

module.exports = function () {
  return (
    <article className="main-content">
      <div className="container">
        <FormattedHTMLMessage id="terms_of_use_main" />
        <FormattedHTMLMessage id="terms_of_use_privacy" />
      </div>
    </article>
  )
}
