'use strict'

var React = require('react')
var Draft = require('draft-js')

var DraftEditor = require('draft-js-plugins-editor').default
var createMentionPlugin = require('draft-js-mention-plugin').default
var createLinkifyPlugin = require('draft-js-linkify-plugin').default
var createEmojiPlugin = require('draft-js-emoji-plugin').default
var Immutable = require('immutable')
var fromJS = require('immutable').fromJS
var request = require('superagent')

var INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'},
    {label: 'Monospace', style: 'CODE'}
]

var BLOCK_TYPES = [
    {label: 'Img', style: 'draft-editor-img', blockType: 'img-block'}
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

class BlockTypeButton extends React.Component {
  constructor() {
    super()
    this.onToggle = (e) => {
      e.preventDefault()
      this.props.onToggle(this.props.blockType)
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

const BlockTypeControls = (props) => {
  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type =>
        <BlockTypeButton
          key={type.label}
          active={false}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
          blockType={type.blockType}
        />
      )}
    </div>
  )
}

var ImgComponent = React.createClass({
  render: function () {
    var url=this.props.blockProps.url
    if (url) {
      return (<img src={url} alt={"URL: "+url} width="100%" />)
    } else {
      return (<span></span>)
    }
      
  }
})

var Editor = React.createClass({

  getInitialState: function() {
    return {
      suggestions: fromJS([]),
      mentionPlugin: createMentionPlugin({
        entityMutability: 'SEGMENTED',
        mentionPrefix: '',
      }),
      linkifyPlugin: createLinkifyPlugin({
        target: '_blank',
      }),
      emojiPlugin: createEmojiPlugin()
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
            avatar: option.payload.thumb_picture_url || '/img/profile/face.svg',
            link: '/wolontariusz/' + option.payload.id
          }
        })
        that.setState({
          suggestions: fromJS(mentions)
        })
      })
  },


  //https://github.com/facebook/draft-js/blob/69890ed57b5f4256cc93ae8e9ea178296851a23e/src/model/modifier/RichTextEditorUtil.js
  handleReturn(e) {
      var that = this
        this.props.onChange(function () {

              var contentState = Draft.Modifier.splitBlock (
                that.props.editorState.getCurrentContent(),
                that.props.editorState.getSelection()
              );

              var newEditorState = Draft.EditorState.push(
                that.props.editorState,
                contentState,
                'split-block'
              );

              var newState = Draft.EditorState.forceSelection(
                newEditorState,
                contentState.getSelectionAfter()
              );

              var contentState2 = Draft.Modifier.insertText(
                newState.getCurrentContent(),
                newState.getSelection(),
                '\u200E',
                newState.getCurrentInlineStyle(),
                null
              );

              var newEditorState2 = Draft.EditorState.push(
                newState,
                contentState2,
                'insert-characters'
              );

              return Draft.EditorState.forceSelection(
                newEditorState2,
                contentState2.getSelectionAfter()
              );
          }());

      return true;
   
  },

  toggleInlineStyle: function(inlineStyle) {
    this.props.onChange(
      Draft.RichUtils.toggleInlineStyle(
        this.props.editorState,
        inlineStyle
      )
    )
  },

  toggleBlockType: function(blockType) {
    this.props.onChange(
      Draft.RichUtils.toggleBlockType(
        this.props.editorState,
        blockType
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
        <div>
          <InlineStyleControls
            editorState={this.props.editorState}
            onToggle={this.toggleInlineStyle} />

          <BlockTypeControls
            editorState={this.props.editorState}
            onToggle={this.toggleBlockType} />

          <this.state.mentionPlugin.MentionSuggestions
            onSearchChange={ this.onSearchChange }
            suggestions={ this.state.suggestions } />

          <this.state.emojiPlugin.EmojiSuggestions />
        </div>
      )
    }

    //https://facebook.github.io/draft-js/docs/advanced-topics-block-components.html#content
    var myBlockRenderer = function (contentBlock) {
      var type = contentBlock.getType();
      var text = contentBlock.getText();

      //https://medium.freecodecamp.com/how-to-reverse-a-string-in-javascript-in-3-different-ways-75e4763c68cb#.6x0nf8pc7
      var modifiedUrlArray = text.split("")
      var reversedUrlArray = modifiedUrlArray.reverse()
      var reversedUrl = reversedUrlArray.join("")

      var firstCharIndex = text.search(/[a-z0-9\/]+/i)
      var lastCharIndex = reversedUrl.search(/[a-z0-9]+/i)
      var length = text.length-firstCharIndex-lastCharIndex
      var modifiedText = text.substr(firstCharIndex, length)

      //TODO: przetestuj Janek sobie Twój pomysł, jak chcesz odkomentując to
      // a zakomentujac if (type == "atomic")
      //var isUrl = ( modifiedText.search(/^(http:\/\/|https:\/\/|\/){1}/) > -1) 
      //var isImg = ( modifiedText.search(/(\.png|\.jpg|\.jpeg|\.bmp|\.svg){1}$/) > -1)
      //if (isUrl && isImg) {
      if (type == "img-block") {
        return {
          component: ImgComponent,
          editable: true,
          props: {
            url: modifiedText
          }
        };
      }
    }

    //https://facebook.github.io/draft-js/docs/advanced-topics-custom-block-render-map.html#content
    const blockRenderMap = Immutable.Map({
      'img-block': {
        element: 'img-block'
      }
    });
    const myBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);

    return (
      <div>
        {controls}

        <div onClick={this.focus} className={this.props.readOnly ? '' : 'myEditor'} style={this.props.style}>

          <DraftEditor
            ref="editor"
            placeholder="Wpisz komentarz..."
            editorState={this.props.editorState}
            plugins={[
              this.state.mentionPlugin,
              this.state.linkifyPlugin,
              this.state.emojiPlugin
            ]}
            readOnly={this.props.readOnly}
            onChange={this.props.onChange}
            handleReturn={this.handleReturn}
            blockRendererFn={myBlockRenderer}
            blockRenderMap={myBlockRenderMap} 
            />
            
        </div>

        {this.props.children}
      </div>
    )
  }
})

module.exports = Editor
