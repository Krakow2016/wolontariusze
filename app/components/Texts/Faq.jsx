var React = require('react')
var Question = require('./Question.jsx')
var FormattedMessage = require('react-intl').FormattedMessage

module.exports = React.createClass({

  render: function(){
    return (
      <div className="faq-content">
        <h1 id="faq-header" className="smooth"><FormattedMessage id="footer_faq" /></h1>
        <h2 className="text--center smooth"><FormattedMessage id="faq_general" /></h2>
        <Question question="faq_1" answer="faq_1_answer" />
        <Question question="faq_2" answer="faq_2_answer" />
        <Question question="faq_3" answer="faq_3_answer" />
        <Question question="faq_5" answer="faq_5_answer" />
        <Question question="faq_6" answer="faq_6_answer" />
        <Question question="faq_7" answer="faq_7_answer" />
        <Question question="faq_8" answer="faq_8_answer" />
        <Question question="faq_9" answer="faq_9_answer" />
        <Question question="faq_10" answer="faq_10_answer" />
        <Question question="faq_11" answer="faq_11_answer" />
        <Question question="faq_12" answer="faq_12_answer" />
        
        <h2 className="text--center smooth"><FormattedMessage id="bank" /></h2> 
        <Question question="faq_13" answer="faq_13_answer" />
        <Question question="faq_14" answer="faq_14_answer" />
        <Question question="faq_15" answer="faq_15_answer" />
        <Question question="faq_16" answer="faq_16_answer" />
        <Question question="faq_17" answer="faq_17_answer" />

        <h2 className="text--center smooth"><FormattedMessage id="faq_add_task" /></h2> 
        <Question question="faq_18" answer="faq_18_answer" />
        <Question question="faq_19" answer="faq_19_answer" />
        <Question question="faq_20" answer="faq_20_answer" />
        <Question question="faq_21" answer="faq_21_answer" />
        <Question question="faq_22" answer="faq_22_answer" />

        <h2 className="text--center smooth"><FormattedMessage id="faq_mobile" /></h2> 
        <Question question="faq_23" answer="faq_23_answer" />
        <Question question="faq_24" answer="faq_24_answer" />
        <Question question="faq_25" answer="faq_25_answer" />
        <Question question="faq_26" answer="faq_26_answer" />

      </div>
    )
  }
})
// <Question question="" answer="" />
        // <Question question="" answer="" />
                // <Question question="" answer="" />
                        // <Question question="" answer="" />