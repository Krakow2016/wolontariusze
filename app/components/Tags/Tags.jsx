var React = require('react')
var NewTag = require('./NewTag.jsx')

var Tags = React.createClass({
  render: function() {
    var that = this
    var data = this.props.data || []
    return (
      <div>
        <ul>
          {data.map(function(li) {
            return (
              <li key={li}>
                <span>{li}</span>
                <input type="button" value="usuń" className="button--xsm btn-category-remove bg--error" data-tag={li} onClick={that.props.onRemove} />
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
