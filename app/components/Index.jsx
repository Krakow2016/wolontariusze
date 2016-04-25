var React = require('react')
var NavLink = require('fluxible-router').NavLink
var request = require('superagent')

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
    this.loadInsta()
    this.props.context.getStore(IndexStore)
      .addChangeListener(this._changeListener)

    var user = this.props.context.getUser()
    if(user && user.is_admin) {
      context.executeAction(actions.showIndex, {}, function() {})
    }
  },

  componentWillUnmount: function() {
    this.loadInsta()
    this.props.context.getStore(IndexStore)
      .removeChangeListener(this._changeListener)
  },

  loadInsta: function(){
    var that = this
    request
      .get('/instagram/all')
      .end(function(err, resp){
        if(err) {
          that.setState({
            error: err,
            media: null
          })
        } else {
          that.setState({
            error: null,
            media: resp.body.data
          })
        }
      })
  },

  render: function () {
    var stats

    var insta_content

    if(this.state.media){
      var media = this.state.media.map(function(img) {
        return (
          <a href={img.link}><img src={img.images.low_resolution.url} key={img.id}/></a>
        )
      })
      insta_content = (
        <div className="row">{ media }</div>
      )
    }

    var user = this.props.context.getUser()
    if(user && user.is_admin) {
      stats = (
        <table style={{width: '100%'}}>
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
        <img src="/img/homepage/inspiration.svg" id="inspiration-img" />
        <img src="/img/homepage/graph.png" style={{width: '100%'}} alt="" />
        <div className="graph-filter">
          <div className="row">
            <div className="col col4">
              <div className="row">
                <div className="col col6">
                  <img src="/img/homepage/VOLUNTEERS.svg" alt="" />
                  <p>WOLONTARIUSZE</p>
                </div>
                <div className="col col6 graph-filter-input-container">
                  <input type="text" className="graph-filter-input" placeholder="NAZWA" />
                  <input type="text" className="graph-filter-input" placeholder="NUMER ID" />
                </div>
              </div>
            </div>
            <div className="col col4"><img src="/img/homepage/HOUR.svg" alt="" /><p>GODZINA</p></div>
            <div className="col col4"><img src="/img/homepage/LOCATION.svg" alt="" /><p>LOKALIZACJA</p></div>
          </div>
        </div>

        <section className="volunteer-dashboard">
          <div className="dashboard-container">
            <div className="row">
              <div className="col col4">
                <img src="/img/homepage/bialy_chlopek.svg" alt="" />
                <img src="/img/homepage/biala_babka.svg" alt="" />
                <p>WOLONTARIUSZE</p>
                <p className="dashboard-hours">?</p>
              </div>
              <div className="col col4">
                <img src="/img/homepage/biale_buty.svg" alt="" />
                <p>WYKONANE ZADANIA</p>
                <p className="dashboard-hours">?</p>
              </div>
              <div className="col col4">
                <img src="/img/homepage/bialy_zegar.svg" alt="" />
                <p>POŚWIĘCONY CZAS</p>
                <p className="dashboard-hours">?</p>
              </div>
            </div>
          </div>
        </section>

        <section className="tiles-container why-and-what">
          <div className="row">
            <div className="col col6">
              <h1 className="text--center">CZEMU GÓRA DOBRA?</h1>
              <div className="row">
                <div className="col col6"><img src="/img/homepage/why.jpg" alt="" /></div>
                <div className="col col6">
                  <p>
                  Na pewno zdarzyło Ci się kiedyś patrzeć na góry.
                  Nieważne czy lubisz zdobywać szczyty czy nie, spojrzałeś w górę i ogarnął Cię ich ogrom.
                  Możesz to sobie w każdej chwili wyobrazić...
                  </p>
                  <a href="/czemu-gora-dobra">CZYTAJ WIĘCEJ</a>

                </div>
              </div>
            </div>

            <div className="col col6">
              <h1 className="text--center">CZYM JEST GÓRA DOBRA?</h1>
              <div className="row">
                <div className="col col6"><img src="/img/homepage/what.jpg" alt="" /></div>
                <div className="col col6">
                  <p>
                   „Góra Dobra to portal dla Wolontariuszy Światowych Dni Młodzieży Kraków 2016 w całości przygotowywany przez nich.
                   Góra Dobra to też wspólnota młodych i zaangażowanych osób pełnych pasji...
                  </p>
                  <a href="/czym-jest-gora-dobra">CZYTAJ WIĘCEJ</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="tiles-container how-and-who">
          <div className="row">
            <div className="col col6">
              <h1 className="text--center">JAK TO DZIAŁA?</h1>
              <div className="row">
                <div className="col col6"><img src="/img/homepage/how.jpg" alt="" /></div>
                <div className="col col6">
                  <p>Indywidualne profile dają możliwość udziału w wydarzeniach, umieszczania wpisów czy  dzielenia się efektami swojej pracy. Połączenie z Instagramem pomoże w uwiecznianiu najwspanialszych momentów...
                  </p>
                  <a href="/jak-dziala-gora-dobra">CZYTAJ WIĘCEJ</a>
                </div>
              </div>
            </div>

            <div className="col col6">
              <h1 className="text--center">KTO TWORZY GD?</h1>
              <div className="row">
                <div className="col col6"><img src="/img/homepage/who.jpg" alt="" /></div>
                <div className="col col6">
                  <p>
                    Górę Dobra tworzą:<br/>
                    Wolontariusze ŚDM Kraków 2016<br/>
                    Koordynatorzy wolontariatu<br/>
                    Potrzebujemy osób takich jak Ty- chętnych do współpracy ...
                  </p>
                  <a href="/kto-jest-zaangazowany">CZYTAJ WIĘCEJ</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="insta">
          <div className="insta-header">
            <img src="/img/homepage/aparacik.svg" alt="" />
            <span>#KRAKOW2016</span>
          </div>
          <div className="insta-content">
            {insta_content}
          </div>
        </div>

        {stats}
      </div>
    )
  }
})


/* Module.exports instead of normal dom mounting */
module.exports = App
