var React = require('react')
var update = require('react-addons-update')
var MyTextField = require('../Formsy/MyTextField.jsx')
var Tags = require('../Tags/Tags.jsx')
var NavLink = require('fluxible-router').NavLink

var TaskFilters = React.createClass({

  getInitialState: function () {
    var that = this
    return {
      open: false,
      checkboxes: {
        typeCheckbox: false,
        priorityCheckbox: false,
        placeCheckbox: false,
        categoryCheckbox: false,
        timeStateCheckbox: false,
        availabilityStateCheckbox: false
      },
      selects: {
        act_type: 'niezdefiniowany',
        priority: 'NORMALNE',
        timeState: 'trwajace',
        availabilityState: 'wolne'
      },
      place: {
        distance: 10.0,  //km
        lat: 49.8883,   //wspolrzedne z Open Street Map
        lon: 20.0986,
      },
      //placeAddress: 'Dobczyce',
      tags: ['Wolontariat+']
    }
  },

  toggleOpen: function () {
    var open = this.state.open
    this.setState(update(this.state, {
      open: {$set: !open }
    }))
  },

  handleCheckboxChange: function (evt) {
    //tak jak w ActivityAdministration
    var checkboxes = {}
    var value = evt.target.checked
    checkboxes[evt.target.name] = {$set: value}
    this.setState(update(this.state, {
      checkboxes: checkboxes
    }))
  },

  handleSelectChange: function (evt) {
    var selects = {}
    var value = evt.target.value
    selects[evt.target.name] = {$set: value}
    this.setState(update(this.state, {
      selects: selects
    }))
  },

  handlePlaceChange: function (evt) {
    var place = {}
    var value = evt.target.value
    value = parseFloat(value)
    place[evt.target.name] = {$set: value}
    if (isNaN(value)) {
      return
    }
    this.setState(update(this.state, {
      place: place
    }))
  },
  
  
  handlePlaceSelectChange: function (evt) {
    var place = {}
    var value = evt.target.value
    var lat_lon = value.split(',')
    if (isNaN(lat_lon[0]) || isNaN(lat_lon[1]) ) {
      return
    }
    place['lat'] = {$set: parseFloat(lat_lon[0])}
    place['lon'] = {$set: parseFloat(lat_lon[1])}

    this.setState(update(this.state, {
      place: place
    }))
  },
  
  saveTag: function(tag) {
    this.state.tags = this.state.tags || []
    this.setState(update(this.state, {
        tags: {$push: [tag]}
    }))
  },

  removeTag: function(e) {
    var tag = e.target.dataset.tag
    var index = this.state.tags.indexOf(tag)
    this.setState(update(this.state, {
        tags: {$splice: [[index, 1]]}
    }))
  },

  getUrl: function () {
    var query = this.props.query
    var checkboxes = this.state.checkboxes
    var selects = this.state.selects
    var place = this.state.place
    
    checkboxes.typeCheckbox ? (query.act_type = selects.act_type) : (delete query.act_type)
    checkboxes.priorityCheckbox ? (query.priority = selects.priority) : (delete query.priority)
    
    checkboxes.placeCheckbox ? (query.placeDistance = place.distance) : (delete query.placeDistance)
    checkboxes.placeCheckbox ? (query.placeLat = place.lat) : (delete query.placeLat)
    checkboxes.placeCheckbox ? (query.placeLon = place.lon) : (delete query.placeLon)
    
    checkboxes.categoryCheckbox ? (query.tags = this.state.tags.map(function (tag) {return encodeURIComponent(tag)}).join(';') ) : (delete query.tags)
    checkboxes.timeStateCheckbox && query.created_by ? (query.timeState = selects.timeState) : (delete query.timeState)
    checkboxes.availabilityStateCheckbox && query.created_by  ? (query.availabilityState = selects.availabilityState) : (delete query.availabilityState)
    
    // Zapisuje zapytanie w adresie url
    var attributes = Object.keys(query).filter(function(key) {
      return query[key]
    }).map(function(key) {
      return key + '=' + query[key]
    }).join('&')
    return '/zadania?'+ attributes
  },

  render: function () {

    var filterByType = <div>
                        <input id="typeCheckbox" type="checkbox" name="typeCheckbox" checked={this.state.checkboxes.typeCheckbox} onChange={this.handleCheckboxChange} />
                        <label htmlFor="typeCheckbox">Typ</label>
                        <br></br>
                        <select name="act_type" selected={this.state.selects.act_type}  onChange={this.handleSelectChange} >
                          <option value="niezdefiniowany">Niezdefiniowany</option>
                          <option value="dalem_dla_sdm">Dałem dla ŚDM</option>
                          <option value="wzialem_od_sdm">Wziąłęm od ŚDM</option>
                        </select>
                       </div>
    var filterByPriority = <div>
                              <input id="priorityCheckbox" type="checkbox" name="priorityCheckbox" checked={this.state.checkboxes.priorityCheckbox} onChange={this.handleCheckboxChange} />
                              <label htmlFor="priorityCheckbox">Priorytet</label>
                              <select name="priority" selected={this.state.selects.priority} onChange={this.handleSelectChange}>
                                <option value="NORMALNE">NORMALNE</option>
                                <option value="PILNE">PILNE</option>
                              </select>
                            </div>
    var filterByPlace = <div>
                          <Formsy.Form>
                            <input id="placeCheckbox" type="checkbox" name="placeCheckbox" checked={this.state.checkboxes.placeCheckbox} onChange={this.handleCheckboxChange} />
                            <label htmlFor="placeCheckbox">Miejsce</label>
                            <span className="tasks-filters-filterType"><br></br> Oddalone o</span>
                              <MyTextField id='distance'
                                          name='distance'
                                          validations='isFloat'
                                          value={this.state.place.distance}
                                          validationError='Powinno być np. 2.05'
                                          onChange={this.handlePlaceChange}/>
                            <span className="tasks-filters-filterType">km od</span>
                            <span className="tasks-filters-filterType"><br></br>Współrzędne geograficzne (sz, dł): </span>
                              <MyTextField id='lat'
                                          name='lat'
                                          validations='isFloat'
                                          value={this.state.place.lat}
                                          validationError='Powinno być np. 51.12'
                                          onChange={this.handlePlaceChange}/>
                              <MyTextField id='lon'
                                          name='lon'
                                          validations='isFloat'
                                          validationError='Powinno być np. 51.12'
                                          value={this.state.place.lon}
                                          onChange={this.handlePlaceChange}/>
                              <span className="tasks-filters-filterType"><br></br>Wybierz z listy </span>
                              <select name="placeSelect" onChange={this.handlePlaceSelectChange}>
                                <option value="0.0,0.0">Brak</option>
                                <option value="49.8883,20.0986">Dobczyce</option>
                                <option value="50.0468,20.0047">Kraków</option>
                              </select>
                              <span>, współrzędne wzięte z OSM, © autorzy <a href="//www.openstreetmap.org/copyright">OpenStreetMap</a></span>
                          </Formsy.Form>
                        </div>
    var tags = this.state.tags || []
    var filterByCategory = <div>
                              <input id="categoryCheckbox" type="checkbox" name="categoryCheckbox" checked={this.state.checkboxes.categoryCheckbox} onChange={this.handleCheckboxChange} />
                              <label htmlFor="categoryCheckbox">Kategoria</label>
                              <Tags data={tags} onSave={this.saveTag} onRemove={this.removeTag} />
                            </div>
    var filterByTimeState
    var filterByAvailabilityState
    if (this.props.query.created_by && this.props.query.created_by.length>0) {
      filterByTimeState = <div>
                              <input id="timeStateCheckbox" type="checkbox" name="timeStateCheckbox" checked={this.state.checkboxes.timeStateCheckbox} onChange={this.handleCheckboxChange} />
                              <label htmlFor="timeStateCheckbox">Stan czasowy</label>
                              <select name="timeState" selected={this.state.selects.timeState} onChange={this.handleSelectChange} >
                                <option value="trwajace">Trwające</option>
                                <option value="zakonczone">Zakończone</option>
                              </select>
                            </div>
      filterByAvailabilityState = <div>
                                <input id="availabilityStateCheckbox" type="checkbox" name="availabilityStateCheckbox" checked={this.state.checkboxes.availabilityStateCheckbox} onChange={this.handleCheckboxChange} />
                                <label htmlFor="availabilityStateCheckbox">Dostępność</label>
                                <select name="availabilityState" selected={this.state.selects.availabilityState} onChange={this.handleSelectChange}>
                                  <option value="wolne">Wolne</option>
                                  <option value="pelne">Pełne</option>
                                </select>
                              </div>
    }

    var filterLink = <NavLink href={this.getUrl()}>Filtruj</NavLink>

    
    var filters
    if (!this.state.open) {
      filters = <div className="tasks-filters-closed">
                  <span onClick={this.toggleOpen} >Filtry (rozwiń)</span>
                </div>
    } else {
      filters = <div className="tasks-filters-open">
                  <span onClick={this.toggleOpen} >Filtry (zwiń) </span>
                  {filterByType}
                  {filterByPriority}
                  {filterByPlace}
                  {filterByCategory}
                  {filterByTimeState}
                  {filterByAvailabilityState}
                  {filterLink}
                </div>
    }

    return (
      <div>{filters}</div>
    )

  }

})


/* Module.exports instead of normal dom mounting */
module.exports = TaskFilters
