var React = require('react')
var NavLink = require('fluxible-router').NavLink
var request = require('superagent')
var FormattedMessage = require('react-intl').FormattedMessage

var IndexStore = require('../stores/Index')
var actions = require('../actions')

var App = React.createClass({

  propTypes: {
    context: React.PropTypes.object
  },

  getInitialState: function () {
    return this.props.context.getStore(IndexStore).data || {}
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(IndexStore).data)
  },

  componentDidMount: function() {
    //this.loadInsta()
    this.props.context.getStore(IndexStore)
      .addChangeListener(this._changeListener)

    context.executeAction(actions.showIndex, {}, function() {})
  },

  componentWillUnmount: function() {
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
          <a href={img.link} key={img.id}><img src={img.images.low_resolution.url}/></a>
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
          <tbody>
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
          </tbody>
        </table>
      )
    }

    return (
      <div>
        <div id="inspiration-img"><img src="/img/homepage/inspiration.svg" /></div>
        <img src="/img/homepage/graph.png" style={{width: '100%'}} alt="" />
        <div className="graph-filter">
          <div className="row">
            <div className="col col4">
              <img src="/img/homepage/VOLUNTEERS.svg" alt="" />
              <p>WOLONTARIUSZ</p>
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
                <p><FormattedMessage id="volunteers_hp" /></p>
                <p className="dashboard-hours">{ this.state.total_active }</p>
              </div>
              <div className="col col4">
                <img src="/img/homepage/biale_buty.svg" alt="" />
                <p><FormattedMessage id="tasks_hp" /></p>
                <p className="dashboard-hours">{ this.state.total_archived }</p>
              </div>
              <div className="col col4">
                <img src="/img/homepage/bialy_zegar.svg" alt="" />
                <p><FormattedMessage id="time_hp" /></p>
                <p className="dashboard-hours">24h/7d</p>
              </div>
            </div>
          </div>
        </section>

        <section className="tiles-container why-and-what">
          <div className="row">
            <div className="col col6">
              <h1 className="text--center"><FormattedMessage id="why_gd" /></h1>
              <div className="row">
                <div className="col col6"><img src="/img/homepage/why.jpg" alt="" /></div>
                <div className="col col6">
                  <p>
                    <FormattedMessage id="why_gd_answer" />
                  </p>
                  <NavLink href="/czemu-gora-dobra"><FormattedMessage id="read_more" /></NavLink>

                </div>
              </div>
            </div>

            <div className="col col6">
              <h1 className="text--center"><FormattedMessage id="what_gd" /></h1>
              <div className="row">
                <div className="col col6"><img src="/img/homepage/what.jpg" alt="" /></div>
                <div className="col col6">
                  <p><FormattedMessage id="what_gd_answer" /></p>
                  <NavLink href="/czym-jest-gora-dobra"><FormattedMessage id="read_more" /></NavLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="tiles-container how-and-who">
          <div className="row">
            <div className="col col6">
              <h1 className="text--center"><FormattedMessage id="how_gd" /></h1>
              <div className="row">
                <div className="col col6"><img src="/img/homepage/how.jpg" alt="" /></div>
                <div className="col col6">
                  <p><FormattedMessage id="how_gd_answer" /></p>
                  <NavLink href="/jak-dziala-gora-dobra"><FormattedMessage id="read_more" /></NavLink>
                </div>
              </div>
            </div>

            <div className="col col6">
              <h1 className="text--center"><FormattedMessage id="who_gd" /></h1>
              <div className="row">
                <div className="col col6"><img src="/img/homepage/who.jpg" alt="" /></div>
                <div className="col col6">
                  <p><FormattedMessage id="who_gd_answer" /></p>
                  <NavLink href="/kto-jest-zaangazowany"><FormattedMessage id="read_more" /></NavLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        {stats}
      </div>
    )
  }
})


/* Module.exports instead of normal dom mounting */
module.exports = App
