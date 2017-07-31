var React = require('react')
var FormattedMessage = require('react-intl').FormattedMessage
var FormattedHTMLMessage = require('react-intl').FormattedHTMLMessage

module.exports = function() {
  return (
    <div>
      <FormattedMessage id="disclamer_3" tagName="p" />
      <FormattedHTMLMessage id="disclamer_4" tagName="p" />
    </div>
  )
}
