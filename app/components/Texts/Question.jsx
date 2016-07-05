var React = require('react')

module.exports = React.createClass({

	getInitialState: function(){
		var state = {
			open: false
		}
		return state
	},

	onClicked: function(){
		this.setState({
			open: !this.state.open
		})
	},

	render: function() {
		var answerClass = !this.props.question || !this.props.answer ? "empty" : this.state.open ? "open" : "";

		return (
			<div className="faq-one">
				<div className={"faq-one-question " + answerClass} onClick={this.onClicked}>{this.props.question}</div>
				<div className={"faq-one-content " + answerClass}><p>{this.props.answer}</p></div>
			</div>
		)
	}


})