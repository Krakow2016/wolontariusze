var React = require('react')
var NavLink = require('fluxible-router').NavLink

var IndexStore = require('../stores/Index')
var actions = require('../actions')

var App = React.createClass({

  getInitialState: function () {
    return this.props.context.getStore(IndexStore).data || {}
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(IndexStore).data)
  },

  componentDidMount: function() {
    this.props.context.getStore(IndexStore)
      .addChangeListener(this._changeListener)

    var user = this.props.context.getUser()
    if(user && user.is_admin) {
      context.executeAction(actions.showIndex, {}, function() {})
    }
  },

  componentWillUnmount: function() {
    this.props.context.getStore(IndexStore)
      .removeChangeListener(this._changeListener)
  },

  render: function () {
    var stats

    var user = this.props.context.getUser()
    if(user && user.is_admin) {
      stats = (
        <table>
          <tr>
            <td>
              Liczba kont w systemie:
            </td>
            <td>
              {this.state.total_accounts}
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
              {this.state.total_volunteers}
            </td>
            <td>
              <NavLink href="/import">
                Importuj
              </NavLink>
            </td>
          </tr>
          <tr>
            <td>
              Liczba aktywnych kont w systemie:
            </td>
            <td>
              {this.state.total_active}
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              Liczba administratorów w systemie:
            </td>
            <td>
              {this.state.total_admins}
            </td>
            <td></td>
          </tr>
        </table>
      )
    }

    return (
      <div>
        <p>
          To jest strona główna. Za jej stworzenie odpowiada Martin ☺
        </p>
        {stats}
      </div>
    )
  }
})


/* Module.exports instead of normal dom mounting */
module.exports = App
