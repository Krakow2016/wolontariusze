var React = require('react')
var update = require('react-addons-update')
var Tags = require('../Tags/Tags.jsx')
var TaskSearchInput = require('./TaskSearchInput.jsx')
var navigateAction = require('fluxible-router').navigateAction

var TaskFilters = React.createClass({

  propTypes: {
    query: React.PropTypes.object,
    context: React.PropTypes.object,
    handleChange: React.PropTypes.function,
    saveTag: React.PropTypes.function,
    removeTag: React.PropTypes.function,
    onSubmit: React.PropTypes.function
  },

  getInitialState: function () {
    //var that = this
    return {
      open: false,
      selects: {
        //act_type: 'niezdefiniowany',
        //priority: 'NORMALNE',
        //timeState: 'trwajace',
        //availabilityState: 'wolne'
      },
      tags: ['Wolontariat+']
    }
  },

  toggleOpen: function () {
    var open = this.state.open
    this.setState(update(this.state, {
      open: {$set: !open }
    }))
  },

  //handlePlaceChange: function (evt) {
    //var place = {}
    //var value = evt.target.value
    //value = parseFloat(value)
    //place[evt.target.name] = {$set: value}
    //if (isNaN(value)) {
      //return
    //}
    //this.setState(update(this.state, {
      //place: place
    //}))
  //},


  //handlePlaceSelectChange: function (evt) {
    //var place = {}
    //var value = evt.target.value
    //var lat_lon = value.split(',')
    //if (isNaN(lat_lon[0]) || isNaN(lat_lon[1]) ) {
      //return
    //}
    //place['lat'] = {$set: parseFloat(lat_lon[0])}
    //place['lon'] = {$set: parseFloat(lat_lon[1])}

    //this.setState(update(this.state, {
      //place: place
    //}))
  //},

  selectActivity: function (activityId) {
    this.props.context.executeAction(navigateAction, {url: '/zadania/'+activityId})
  },

  render: function () {

    //var filterByPlace = <div>
                          //<Formsy.Form>
                            //<span className="tasks-filters-filterType"><br></br> Oddalone o</span>
                              //<MyTextField id='distance'
                                          //name='distance'
                                          //validations='isFloat'
                                          //value={this.state.place.distance}
                                          //validationError='Powinno być np. 2.05'
                                          //onChange={this.handlePlaceChange}/>
                            //<span className="tasks-filters-filterType">km od</span>
                            //<span className="tasks-filters-filterType"><br></br>Współrzędne geograficzne (sz, dł): </span>
                              //<MyTextField id='lat'
                                          //name='lat'
                                          //validations='isFloat'
                                          //value={this.state.place.lat}
                                          //validationError='Powinno być np. 51.12'
                                          //onChange={this.handlePlaceChange}/>
                              //<MyTextField id='lon'
                                          //name='lon'
                                          //validations='isFloat'
                                          //validationError='Powinno być np. 51.12'
                                          //value={this.state.place.lon}
                                          //onChange={this.handlePlaceChange}/>
                              //<span className="tasks-filters-filterType"><br></br>Wybierz z listy </span>
                              //<select name="placeSelect" onChange={this.handlePlaceSelectChange}>
                                //<option value="0.0,0.0">Brak</option>
                                //<option value="49.8883,20.0986">Dobczyce</option>
                                //<option value="50.0468,20.0047">Kraków</option>
                              //</select>
                              //<span>, współrzędne wzięte z OSM, © autorzy <a href="//www.openstreetmap.org/copyright">OpenStreetMap</a></span>
                          //</Formsy.Form>
                        //</div>
    var tags = this.props.query.tags || []
    var filterByTimeState
    var filterByAvailabilityState
    if ( (this.props.query.volunteer && this.props.query.volunteer.length>0) ||
         (this.props.query.created_by && this.props.query.created_by.length>0) ) {
      filterByTimeState = <div>
                              <span>Stan czasowy</span>
                              <select name="timeState" selected={this.props.query.timeState || ''} onChange={this.props.handleChange} >
                                <option value="">dowolne</option>
                                <option value="trwajace">Trwające</option>
                                <option value="zakonczone">Zakończone</option>
                              </select>
                            </div>
      filterByAvailabilityState = <div>
                                <span>Dostępność</span>
                                <select name="availabilityState" selected={this.props.query.availabilityState || ''} onChange={this.props.handleChange}>
                                  <option value="">dowolne</option>
                                  <option value="wolne">Wolne</option>
                                  <option value="pelne">Pełne</option>
                                </select>
                              </div>
    }


    var filters
    if (!this.state.open) {
      filters = <div className="tasks-filters-closed">
                  <span onClick={this.toggleOpen} >Filtry (rozwiń)</span>
                </div>
    } else {
      filters = <div className="tasks-filters-open">
                  <span onClick={this.toggleOpen} >Filtry (zwiń) </span>
                  <div>
                      <span>Typ: </span>
                      <select name="act_type" value={this.props.query.act_type || ''}  onChange={this.props.handleChange} >
                          <option value="">dowolny</option>
                          <option value="dalem_dla_sdm">Dałem dla ŚDM</option>
                          <option value="wzialem_od_sdm">Wziąłęm od ŚDM</option>
                      </select>
                  </div>
                  <div>
                      <span>Priorytet: </span>
                      <select name="priority" value={this.props.query.priority || ''} onChange={this.props.handleChange}>
                          <option value="">dowolny</option>
                          <option value="NORMALNE">NORMALNE</option>
                          <option value="PILNE">PILNE</option>
                      </select>
                  </div>
                  <div>
                      <strong>Kategoria</strong>
                      <Tags data={tags} onSave={this.props.saveTag} onRemove={this.props.removeTag} />
                  </div>

                  {filterByTimeState}
                  {filterByAvailabilityState}

                  <button onClick={this.props.onSubmit}>Szukaj</button>
                </div>
    }

    return (
      <div>
        <div id="task-search-row">
          <div id="task-search">
            <TaskSearchInput id="form" className="form menu-search-box" selectActivity={this.selectActivity}/>
            <input src="/img/search.svg" id="task-search-submit" type="image" />
          </div>
        </div>
        {filters}
      </div>
    )

  }

})


/* Module.exports instead of normal dom mounting */
module.exports = TaskFilters
