var React = require('react')
var NavLink = require('fluxible-router').NavLink

module.exports = function() {
  return (
    <NavLink href="/zadania/nowe" className="button">Dodaj nowe zadanie</NavLink>
  )
}
