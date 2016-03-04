var React = require('react')
var NewTag = require('./NewTag.jsx')

var Tags = React.createClass({
  render: function() {
    var that = this
    return (
      <div>
        <ul>
          {this.props.data.map(function(li) {
            return (
              <li key={li}>
                <span>{li}</span>
                <input type="button" value="usuń" data-tag={li} onClick={that.props.onRemove} />
              </li>
              )
          })}
        </ul>
        <NewTag onSave={this.props.onSave} />
      </div>
    )
  }
})

module.exports = Tags
