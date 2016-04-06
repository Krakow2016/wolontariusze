'use strict'

var fromJS = require('immutable').fromJS

var Plugins = require('draft-js-plugins-editor').default
var createMentionsPlugin = require('draft-js-mention-plugin')

var React = require('react')
var Draft = require('draft-js')

var AppStore = require('../stores/ApplicationStore')

var INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'},
    {label: 'Monospace', style: 'CODE'},
]

class StyleButton extends React.Component {

  constructor() {
    super()
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    }
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle()
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  )
}

var Editor = React.createClass({

  getInitialState: function() {
    const mentions = fromJS(this.props.context.getStore(AppStore).autocomplete)
    var mentionsPlugin = createMentionsPlugin.default({mentions: mentions})
    return {
      plugins: [ mentionsPlugin ]
    }
  },

  toggleInlineStyle: function(inlineStyle) {
    this.props.onChange(
      Draft.RichUtils.toggleInlineStyle(
        this.props.editorState,
        inlineStyle
      )
    )
  },

  focus: function() {
    //this.refs.editor.focus()
  },

  render: function() {
    return (
      <div>
        <InlineStyleControls
          editorState={this.props.editorState}
          onToggle={this.toggleInlineStyle} />

        <div onClick={this.focus} className="myEditor" style={this.props.style}>
          <Plugins
            ref="editor"
            plugins={this.state.plugins}
            placeholder="Wpisz komentarz..."
            editorState={this.props.editorState}
            onChange={this.props.onChange} />
        </div>

        {this.props.children}
      </div>
    )
  }
})

module.exports = Editor
