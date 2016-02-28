var React = require('react')
var update = require('react-addons-update')

var MyTextField = require('../Formsy/MyTextField.jsx')

var AddedTag = React.createClass({
  //onClick: function () {
  //  this.props.onRemoveButtonClick(this.props.tag.id)
  //},
  //<input type="button" className="addedTagRemoveButton" onClick={this.onClick} value="Usuń"/> Przyda się, jeśli będzie więcej kategorii
  name: function() {
    var t = this.props.tag
    return t.display_name || t.name
  },
  render: function () {
    return (
        <div className="addedTag" >(Wybrana kategoria: {this.name()} )</div>
    )
  }
})

var TaskFilters = React.createClass({

  getInitialState: function () {
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
        typeSelect: '',
        prioritySelect: 'NORMALNE',
        timeStateSelect: 'trwajace',
        availabilityStateSelect: 'wolne'
      },
      place: {
        distance: 1.0,  //km
        lat: 49.8883,   //wspolrzedne z Open Street Map
        lon: 20.0986,
      },
      //placeAddress: 'Dobczyce',
      category: {}

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
    if (place[evt.target.name]) {
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
    place['lat'] = {$set: parseFloat(lat_lon[0])}
    place['lon'] = {$set: parseFloat(lat_lon[1])}
    
    if (isNaN(place['lat']) || isNaN(place['lon'])) {
      return
    }

    this.setState(update(this.state, {
      place: place
    }))
  },
  
  addCategory: function (category) {
    this.setState(update(this.state, {
      category: {$set: category}
    }))
  },

  filter: function () {
    var filteredData = this.props.data
    var that = this

    //Typ
    if (this.state.checkboxes.typeCheckbox) {
      filteredData = filteredData.filter(function (task) {
        return that.state.selects.typeSelect == task.type ||
               (that.state.selects.typeSelect == '' && typeof(task.type) == 'undefined')
      })
    }
    
    //Priorytet
    if (this.state.checkboxes.priorityCheckbox) {
      filteredData = filteredData.filter(function (task) {
        var priority = task.is_urgent ? 'PILNE' : 'NORMALNE'
        return that.state.selects.prioritySelect == priority
      })
    }
    
    //Kategoria
    if (this.state.checkboxes.categoryCheckbox) {
      filteredData = filteredData.filter(function (task) {
        for (var i = 0; i < task.tags.length; i++) {
          if (that.state.category.id == task.tags[i].id) {
            return true
          }
        }
        return false
      })
    }

    //Trwające, zakończone
    if (this.state.checkboxes.timeStateCheckbox) {
      filteredData = filteredData.filter(function (task) {
        var currentTime = new Date().getTime()
        var isFinished = (typeof(task.datetime) != 'undefined' && new Date(task.datetime).getTime() < currentTime) || task.is_archived
        return  (that.state.selects.timeStateSelect == 'trwajace' && !isFinished) || 
                (that.state.selects.timeStateSelect == 'zakonczone' && isFinished)
      })
    }
    
    //Dostępność
    if (this.state.checkboxes.availabilityStateCheckbox) {
      filteredData = filteredData.filter(function (task) {
        var isFree = task.volunteerNumber < task.maxVolunteers || task.maxVolunteers == 0
        return  (that.state.selects.availabilityStateSelect == 'wolne' && isFree) || 
                (that.state.selects.availabilityStateSelect == 'pelne' && !isFree)
      })
    }
    
    //Miejsce na końcu, bo może być mniej obiektów do filtrowania (w celu przyspieszenia obliczeń)
    // Orodroma - https://pl.wikipedia.org/wiki/Ortodroma
    // https://en.wikipedia.org/wiki/Great-circle_distance
    // https://pl.wikipedia.org/wiki/Promie%C5%84_Ziemi
    if (this.state.checkboxes.placeCheckbox) {
      filteredData = filteredData.filter(function (task) {
          if (typeof(task.lat_lon) == 'undefined') {
            return false
          }
          var c = Math.PI/180
          var lat1=c*task.lat_lon[0]
          var lat2=c*that.state.place.lat
          var lon1=c*task.lat_lon[1]
          var lon2=c*that.state.place.lon
          var deltaLat = lat1-lat2
          var deltaLon = lon1-lon2
          var radius = 6378.41
          //var underSqrt = Math.sin(deltaLat/2)*Math.sin(deltaLat/2)+Math.cos(lat1)*Math.cos(lat2)*Math.sin(deltaLon/2)*Math.sin(deltaLon/2)
          //var orto = radius*2*Math.asin(Math.sqrt(underSqrt))
          var orto = radius*Math.acos(Math.sin(lat1)*Math.sin(lat2)+Math.cos(lat1)*Math.cos(lat2)*Math.cos(deltaLon))
          //console.log('Task Lat Lon', task.lat_lon)
          //console.log('ORTO', orto)
          if (orto < that.state.place.distance) {
            return true
          }
          return false
            
      })
    }
    
    
    
    this.props.filterFunction(filteredData)
    

  },

  render: function () {

    var filterByType = <div>
                        <input type="checkbox" name="typeCheckbox" checked={this.state.checkboxes.typeCheckbox} onChange={this.handleCheckboxChange} />
                        <span className="tasks-filters-filterType">Typ</span>
                        <select name="typeSelect" selected={this.state.selects.typeSelect}  onChange={this.handleSelectChange} >
                          <option value="">Niezdefiniowany</option>
                          <option value="dalem_dla_sdm">Dałem dla ŚDM</option>
                          <option value="wzialem_od_sdm">Wziąłęm od ŚDM</option>
                        </select>
                       </div>
    var filterByPriority = <div>
                              <input type="checkbox" name="priorityCheckbox" checked={this.state.checkboxes.priorityCheckbox} onChange={this.handleCheckboxChange} />
                              <span className="tasks-filters-filterType">Priorytet</span>
                              <select name="prioritySelect" selected={this.state.selects.prioritySelect} onChange={this.handleSelectChange}>
                                <option value="NORMALNE">NORMALNE</option>
                                <option value="PILNE">PILNE</option>
                              </select>
                            </div>
    var filterByPlace = <div>
                          <Formsy.Form>
                            <input type="checkbox" name="placeCheckbox" checked={this.state.checkboxes.placeCheckbox} onChange={this.handleCheckboxChange} />
                            <span className="tasks-filters-filterType">Miejsce</span>
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
                              <select name="prioritySelect" selected={this.state.selects.prioritySelect} onChange={this.handlePlaceSelectChange}>
                                <option value="0.0,0.0">Brak</option>
                                <option value="49.8883,20.0986">Dobczyce</option>
                                <option value="50.0468,20.0047">Kraków</option>
                              </select>
                              <span>, współrzędne wzięte z OSM, © autorzy <a href="//www.openstreetmap.org/copyright">OpenStreetMap</a></span>
                          </Formsy.Form>
                        </div>
    
    var filterByCategory = <div>
                              <input type="checkbox" name="categoryCheckbox" checked={this.state.checkboxes.categoryCheckbox} onChange={this.handleCheckboxChange} />
                              <span className="tasks-filters-filterType">Kategoria</span>
                              TODO
                              <AddedTag tag={this.state.category} />
                            </div>
    var filterByTimeState
    var filterByAvailabilityState
    if (this.props.type == 'admin') {
      filterByTimeState = <div>
                              <input type="checkbox" name="timeStateCheckbox" checked={this.state.checkboxes.timeStateCheckbox} onChange={this.handleCheckboxChange} />
                              <span className="tasks-filters-filterType">Stan czasowy</span>
                              <select name="timeStateSelect" selected={this.state.selects.timeStateSelect} onChange={this.handleSelectChange} >
                                <option value="trwajace">Trwające</option>
                                <option value="zakonczone">Zakończone</option>
                              </select>
                            </div>
      filterByAvailabilityState = <div>
                                <input type="checkbox" name="availabilityStateCheckbox" checked={this.state.checkboxes.availabilityStateCheckbox} onChange={this.handleCheckboxChange} />
                                <span className="tasks-filters-filterType">Dostępność</span>
                                <select name="availabilityStateSelect" selected={this.state.selects.availabilityStateSelect} onChange={this.handleSelectChange}>
                                  <option value="wolne">Wolne</option>
                                  <option value="pelne">Pełne</option>
                                </select>
                              </div>
    }

    var filterButton = <input type="button" onClick={this.filter} value="Filtruj" key="filterBtn" />

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
                  {filterButton}
                </div>
    }

    return (
      <div>{filters}</div>
    )

  }

})


/* Module.exports instead of normal dom mounting */
module.exports = TaskFilters
