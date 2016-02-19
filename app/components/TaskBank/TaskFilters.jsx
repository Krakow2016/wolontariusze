var React = require('react')
var update = require('react-addons-update')

var MyTextField = require('../Formsy/MyTextField.jsx')
var ActivityTags = require('../ActivityTags.jsx')


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
      placeDistance: '1',
      placeAddress: 'Kraków Kanonicza 14',
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

  handlePlaceDistanceChange: function (evt) {
    var value = evt.target.value
    this.setState(update(this.state, {
      placeDistance: {$set: value}
    }))
  },

  handlePlaceAddressChange: function (evt) {
    var value = evt.target.value
    this.setState(update(this.state, {
      handlePlaceAddressChange: {$set: value}
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
        var isFinished = (typeof(task.startEventTimestamp) != 'undefined' && task.startEventTimestamp < currentTime) || task.is_archived
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
                            <span className="tasks-filters-filterType">Miejsce oddalone o</span>
                              <MyTextField id='placeDistance'
                                          name='placeDistance'
                                          validations='minLength:2'
                                          value={this.state.placeDistance}
                                          onChange={this.handlePlaceDistanceChange}/>
                            <span className="tasks-filters-filterType">km od</span>
                              <MyTextField id='placeAddress'
                                          name='placeAddress'
                                          validations='minLength:2'
                                          value={this.state.placeAddress}
                                          onChange={this.handlePlaceAddressChange}/>
                          </Formsy.Form>
                        </div>
                        
    var addTag = <ActivityTags addTag={this.addCategory}
                               excludedTags={[this.state.category]}
                               context={this.props.context}
                               filterMode={true}/>
    var filterByCategory = <div>
                              <input type="checkbox" name="categoryCheckbox" checked={this.state.checkboxes.categoryCheckbox} onChange={this.handleCheckboxChange} />
                              <span className="tasks-filters-filterType">Kategoria</span>
                              {addTag}
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
