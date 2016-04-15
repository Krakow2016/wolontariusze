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
              <NavLink href="/wyszukiwarka?raw.is_volunteer=true">
                {this.state.total_volunteers}
              </NavLink>
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
              <NavLink href="/wyszukiwarka?doc.has_password=true">
                {this.state.total_active}
              </NavLink>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              Liczba administratorów w systemie:
            </td>
            <td>
              <NavLink href="/wyszukiwarka?doc.is_admin=true">
                {this.state.total_admins}
              </NavLink>
            </td>
            <td></td>
          </tr>
        </table>
      )
    }

    return (
      <div>
        <section className="inspiration">
          <h2 className="text--center">Do not be afraid</h2>
          <p className="text--center">St John Paul II</p>
        </section>
        <img src="/img/homepage/graph.png" style={{width: "100%"}} alt="" />
        <div className="graph-filter">
          <div className="row">
            <div className="col col4">
              <div className="row">
                <div className="col col6">
                  <img src="/img/homepage/VOLUNTEERS.svg" alt="" />
                  <p>VOLUNTEERS</p>
                </div>
                <div className="col col6 graph-filter-input-container">
                  <input type="text" className="graph-filter-input" placeholder="NAME" />
                  <input type="text" className="graph-filter-input" placeholder="ID NUMBER" />
                </div>
              </div>
            </div>
            <div className="col col4"><img src="/img/homepage/HOUR.svg" alt="" /><p>HOUR</p></div>
            <div className="col col4"><img src="/img/homepage/LOCATION.svg" alt="" /><p>LOCATION</p></div>
          </div>
        </div>

        <section className="volunteer-dashboard">
          <div className="dashboard-container">
            <div className="row">
              <div className="col col4">
                <img src="/img/homepage/bialy_chlopek.svg" alt="" />
                <img src="/img/homepage/biala_babka.svg" alt="" />
                <p>VOLUNTEERS</p>
                <p className="dashboard-hours">22000</p>
              </div>
              <div className="col col4">
                <img src="/img/homepage/biale_buty.svg" alt="" />
                <p>JOBS COMPLETED</p>
                <p className="dashboard-hours">3400</p>
              </div>
              <div className="col col4">
                <img src="/img/homepage/bialy_zegar.svg" alt="" />
                <p>VOLUNTEER HOURS</p>
                <p className="dashboard-hours">340000</p>
              </div>
            </div>
          </div>
        </section>

        <section className="tiles-container why-and-what">
          <div className="row">
            <div className="col col6">
              <h1 className="text--center">WHY GÓRA DOBRA?</h1>
              <div className="row">
                <div className="col col6"><img src="http://lorempixel.com/256/215" alt="" /></div>
                <div className="col col6">
                  <p>
                    World Youth Day Krakow 2016
                    is an event of huge scale, for
                    which will arrive more than 2
                    million pilgrims and approx
                    25,000 volunteers.
                  </p>
                  <a href="#">READ MORE...</a>

                </div>
              </div>
            </div>

            <div className="col col6">
              <h1 className="text--center">WHAT IS GÓRA DOBRA?</h1>
              <div className="row">
                <div className="col col6"><img src="http://lorempixel.com/256/215" alt="" /></div>
                <div className="col col6">
                  <p>
                    World Youth Day Krakow 2016
                    is an event of huge scale, for
                    which will arrive more than 2
                    million pilgrims and approx
                    25,000 volunteers.
                  </p>
                  <a href="#">READ MORE...</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="tiles-container how-and-who">
          <div className="row">
            <div className="col col6">
              <h1 className="text--center">HOW IT WORKS?</h1>
              <div className="row">
                <div className="col col6"><img src="http://lorempixel.com/256/215" alt="" /></div>
                <div className="col col6">
                  <p>
                    World Youth Day Krakow 2016
                    is an event of huge scale, for
                    which will arrive more than 2
                    million pilgrims and approx
                    25,000 volunteers.
                  </p>
                  <a href="#">READ MORE...</a>
                </div>
              </div>
            </div>

            <div className="col col6">
              <h1 className="text--center">WHO IS INVOLVED?</h1>
              <div className="row">
                <div className="col col6"><img src="http://lorempixel.com/256/215" alt="" /></div>
                <div className="col col6">
                  <p>
                    World Youth Day Krakow 2016
                    is an event of huge scale, for
                    which will arrive more than 2
                    million pilgrims and approx
                    25,000 volunteers.
                  </p>
                  <a href="#">READ MORE...</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="insta">
          <div className="insta-header">
            <img src="/img/homepage/aparacik.svg" alt="" />
            <span>#Krakow2016</span>
          </div>
          <div className="insta-content">
            <img src="http://lorempixel.com/292/292" alt="" /><img src="http://lorempixel.com/292/292/sports" alt="" /><img src="http://lorempixel.com/292/292/city" alt="" /><img src="http://lorempixel.com/292/292/food" alt="" /><img src="http://lorempixel.com/292/292/cats" alt="" /><img src="http://lorempixel.com/292/292/people" alt="" /><img src="http://lorempixel.com/292/292/nature" alt="" /><img src="http://lorempixel.com/292/292/technics" alt="" />
          </div>
        </div>

        {stats}
      </div>
    )
  }
})


/* Module.exports instead of normal dom mounting */
module.exports = App
