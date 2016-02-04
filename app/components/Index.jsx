var React = require('react')
var NavLink = require('fluxible-router').NavLink

var App = React.createClass({
  render: function () {
    return (
      <p>
        To jest strona główna. Za jej stworzenie odpowiada Martin ☺
      </p>
    )
  }
})


/* Module.exports instead of normal dom mounting */
module.exports = App
