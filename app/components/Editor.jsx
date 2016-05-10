'use strict'

var React = require('react')
var Draft = require('draft-js')

var DraftEditor = require('draft-js-plugins-editor').default
var createMentionPlugin = require('draft-js-mention-plugin').default
var fromJS = require('immutable').fromJS
var request = require('superagent')

var INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'},
    {label: 'Monospace', style: 'CODE'}
]

var mentionPlugin = createMentionPlugin({
  entityMutability: 'IMMUTABLE',
  mentionPrefix: '',
})

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

  getInitialState: function() {
    return {
      suggestions: fromJS([])
    }
  },

  onSearchChange: function(opts) {
    var that = this
    request
      .post('/suggest')
      .send({
        suggest: {
          text: opts.value,
          completion: {
            field: 'suggest'
          }
        }
      })
      .end(function(err, resp) {
        var mentions = resp.body.suggest[0].options.map(function(option){
          return {
            name: option.text,
            id: option.payload.id,
            avatar: option.payload.thumb_picture_url || '/img/profile/face.svg'
          }
        })
        that.setState({
          suggestions: fromJS(mentions)
        })
      })
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
    this.refs.editor.focus()
  },

  render: function() {
    var controls
    if(!this.props.readOnly) {
      controls = (
        <InlineStyleControls
          editorState={this.props.editorState}
          onToggle={this.toggleInlineStyle} />
      )
    }
    return (
      <div>
        {controls}

        <div onClick={this.focus} className="myEditor" style={this.props.style}>

          <DraftEditor
            ref="editor"
            placeholder="Wpisz komentarz..."
            editorState={this.props.editorState}
            plugins={ [mentionPlugin] }
            readOnly={this.props.readOnly}
            onChange={this.props.onChange} />

          <mentionPlugin.MentionSuggestions
            onSearchChange={ this.onSearchChange }
            suggestions={ this.state.suggestions } />

        </div>

        {this.props.children}
      </div>
    )
  }
})

module.exports = Editor
