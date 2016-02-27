var React = require('react')
var NavLink = require('fluxible-router').NavLink
var VolunteerShell = require('./Shell.jsx')
var VolunteerStore = require('../../stores/Volunteer')

var Shell = React.createClass({

  getInitialState: function () {
    return this.props.context.getStore(VolunteerStore).getState().profile
  },

  _changeListener: function() {
    this.replaceState(this.props.context.getStore(VolunteerStore).getState().profile)
  },

  componentDidMount: function() {
    this.props.context.getStore(VolunteerStore)
      .addChangeListener(this._changeListener)
  },

  componentWillUnmount: function() {
    this.props.context.getStore(VolunteerStore)
      .removeChangeListener(this._changeListener)
  },

  render: function() {
    return (
      <VolunteerShell context={this.props.context} profile={this.state}>
        <div className="section group">
            <div className="col span_2_of_4">
                <h1>Dałem dla ŚDM:</h1>
                <h2>Udzielam się w sekcjach:</h2>
                <p className="p-space">Patolodzy dla ŚDM</p>
                <p className="p-space">Pierwsza Pomoc Przedmedyczna</p>
                <h2>Borę udział w projektach:</h2>
                <p className="p-space">Wolontariat +</p>
                <h2>Oprócz tego:</h2>
                <ul>
                    <li>Suscipit a urna urna non venenatis quisque</li>
                    <li>A sit ullamcorper litora parturient enim velit ad ante montes </li>
                    <li>scing facilisi a conubia ipsum parturient mattis </li>
                    <li>suspendisse mi rutrum at egestas cum </li>
                    <li>erat augue facilisis quisque fusce at.</li>
                    <li>Arcu ut etiam dis ad a sed sem convallis turpis id </li>
                    <li>quisque pulvinar penatibus lobortis non. Adipisc</li>
                    <li>To jest lista aktywności wolontariusza. Za implementację odpowiada Paweł.</li>
                    <li><NavLink href="/aktywnosci/nowa">Dodaj aktywność</NavLink></li>
                </ul>
            </div>
            <div className="col span_2_of_4">
                <h1>Otrzymałem od ŚDM:</h1>
                <ul>
                    <li>Suscipit a urna urna non venenatis quisque</li>
                    <li>A sit ullamcorper litora parturient enim velit ad ante montes </li>
                    <li>scing facilisi a conubia ipsum parturient mattis </li>
                    <li>suspendisse mi rutrum at egestas cum </li>
                    <li>erat augue facilisis quisque fusce at.</li>
                    <li>Arcu ut etiam dis ad a sed sem convallis turpis id </li>
                    <li>quisque pulvinar penatibus lobortis non. Adipisc</li>
                </ul>
            </div>
        </div>
      </VolunteerShell>
    )
  }
})

module.exports = Shell
