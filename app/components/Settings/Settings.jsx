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
              <a href="/ustawienia/konto">
                <div className="col span_4_of_4" id="setting-title">
                  <h1>
                    Konto
                  </h1>
                  <span className="blue-line"></span>
                  <img src="/img/arrow.svg" id="set-arr-1" className="setting-arrow down" />
                </div>
              </a>

              <a href="/ustawienia/profil">
                <div className="col span_4_of_4" id="setting-title">
                  <h1>
                    Informacje publiczne
                  </h1>
                  <span className="blue-line"></span>
                  <img src="/img/arrow.svg" id="set-arr-1" className="setting-arrow down" />
                </div>
              </a>

              <a href="/ustawienia/aplikacje">
                <div className="col span_4_of_4" id="setting-title">
                  <h1>
                    Aplikacje
                  </h1>
                  <span className="blue-line"></span>
                  <img src="/img/arrow.svg" id="set-arr-1" className="setting-arrow down" />
                </div>
              </a>
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
