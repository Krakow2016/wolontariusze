var React = require('react')

var NavLink = require('fluxible-router').NavLink
var Menu = require('material-ui/lib/menus/menu')
var MenuItem = require('material-ui/lib/menus/menu-item')
var Paper = require('material-ui/lib/paper')

var VolunteerStore = require('../../stores/Volunteer')

var Settings = React.createClass({
  render: function() {
    return (
      <Paper className="paper">
        <div className="pure-g">
          <div className="pure-u-1-4">
            <Paper zDepth={1}>
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
            </Paper>
          </div>
          <div className="pure-u-3-4">
            {this.props.children}
          </div>
        </div>
      </Paper>
    )
  }
})

module.exports = Settings
