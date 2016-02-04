var React = require('react')

var NavLink = require('fluxible-router').NavLink
var Menu = require('material-ui/lib/menus/menu')
var MenuItem = require('material-ui/lib/menus/menu-item')

var VolunteerStore = require('../../stores/Volunteer')

var Settings = React.createClass({
  render: function() {
    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-1-4">
            <div>
              <NavLink href="/ustawienia/konto">
                Konto
              </NavLink>
              <br />
              <NavLink href="/ustawienia/profil">
                Informacje publiczne
              </NavLink>
              <br />
              <NavLink href="/ustawienia/aplikacje">
                Aplikacje
              </NavLink>
            </div>
          </div>
          <div className="pure-u-3-4">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
})

module.exports = Settings
