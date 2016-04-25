'use strict'

var React = require('react')
var Draft = require('draft-js')

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
      e.preventDefault()
      this.props.onToggle(this.props.style)
    }
  }

  render() {
    let className = 'RichEditor-styleButton'
    if (this.props.active) {
      className += ' RichEditor-activeButton'
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    )
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
          <Draft.Editor
            ref="editor"
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
