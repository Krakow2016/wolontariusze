var React = require('react')
var NavLink = require('fluxible-router').NavLink

var App = React.createClass({
  render: function () {
    return (
      <div>
        <p>
          To jest strona główna. Za jej stworzenie odpowiada Martin ☺
        </p>

        <table>
          <tr>
            <td>
              Liczba kont w systemie:
            </td>
            <td>
              0
            </td>
            <td>
              <NavLink href="/rejestracja">
                Dodaj
              </NavLink>
            </td>
          </tr>
          <tr>
            <td>
              Liczba wolontariuszy krótkoterminowych:
            </td>
            <td>
              0
            </td>
            <td>
              <NavLink href="/import">
                Importuj
              </NavLink>
            </td>
          </tr>
        </table>
      </div>
    )
  }
})


/* Module.exports instead of normal dom mounting */
module.exports = App
