//Inspiracja z http://maps-on-blackboard.com/articles/osm-tiles-map-with-rotation/
var React = require('react')
var MapTheTiles = require('map-the-tiles')
var SphericalMercator = require('sphericalmercator')

var update = require('react-addons-update')

var GeoMap = React.createClass({

  getInitialState: function() {
    var that = this
    return {
      lon: that.props.initialPosition[1],
      lat: that.props.initialPosition[0],
      savedLon: that.props.initialPosition[1],
      savedLat: that.props.initialPosition[0],
      searchValue: '',
      zoomValue: 18,
      movePixel: 5
    }
  },
  onSearchInputChange: function (event) {
    var value = event.currentTarget.value
    this.setState(update(this.state, {
      searchValue: {$set: value}
    }))
  },
  /*
   * Pomocne linki:
   * //https://pl.wikipedia.org/wiki/Znaki_diakrytyczne
   * //http://wiki.openstreetmap.org/wiki/Nominatim
   * 
   * Trzeba spełnić wymagania na stronach:
   * http://wiki.openstreetmap.org/wiki/Tile_usage_policy
   * http://wiki.openstreetmap.org/wiki/Nominatim_usage_policy
   */
  onSearchButtonClick: function () {
    var input = this.state.searchValue     //np. "Kraków Kanonicza 14"

    var output =  input.toLowerCase()
                    .trim()
                    .replace('ą', 'a')
                    .replace('ć', 'c')
                    .replace('ę', 'e')
                    .replace('ł', 'l')
                    .replace('ń', 'n')
                    .replace('ó', 'o')
                    .replace('ś', 's')
                    .replace('ź', 'z')
                    .replace('ż', 'z')
    var query = output
    var searchBaseUrl = 'http://nominatim.openstreetmap.org/search.php?q='
    var searchParams='&format=json'
    var that = this

    var searchUrl = searchBaseUrl+query+searchParams
    var request = new XMLHttpRequest()
    request.open('GET', searchUrl, true)
    console.log("headers", document.referrer)
    console.log("headers", navigator.userAgent)
    
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        console.log('request', request)
        var resp = request.responseText
        //console.log(resp)
        var json = JSON.parse(resp)
        that.setState(update(that.state, {
          lon: {$set: json[0].lon},
          lat: {$set: json[0].lat}
        }))

      }
    }

    request.onerror = function() {
    }

    request.send()
  },
  onSaveButtonClick: function () {
    this.props.saveFunction([this.state.lat, this.state.lon])
    this.setState(update(this.state, {
      savedLon: {$set: this.state.lon},
      savedLat: {$set: this.state.lat}
    }))
  },
  onZoomInButtonClick: function () {
    var zoom = this.state.zoomValue
    if (zoom < 19) {
      zoom++
    }
    this.setState(update(this.state, {
      zoomValue: {$set: zoom}
    }))
  },
  onZoomOutButtonClick: function () {
    var zoom = this.state.zoomValue
    if (zoom > 0) {
      zoom--
    }
    this.setState(update(this.state, {
      zoomValue: {$set: zoom}
    }))
  },
  onLeftClick: function () {
    var merc = new SphericalMercator({size: 256})
    var delta = merc.ll( [this.state.movePixel, 0], this.state.zoomValue)
    var lon = Number(this.state.lon)
    lon -= (180+delta[0])
    this.setState(update(this.state, {
      lon: {$set: lon}
    }))
  },
  onRightClick: function () {
    var merc = new SphericalMercator({size: 256})
    var delta = merc.ll( [this.state.movePixel, 0], this.state.zoomValue)
    var lon = Number(this.state.lon)
    lon += (180+delta[0])
    this.setState(update(this.state, {
      lon: {$set: lon}
    }))    
  },
  onDownClick: function () {
    var merc = new SphericalMercator({size: 256})
    var delta = merc.ll( [this.state.movePixel, 0], this.state.zoomValue)
    var lat = Number(this.state.lat)
    lat -= (180+delta[0])
    this.setState(update(this.state, {
      lat: {$set: lat}
    }))
  },
  onUpClick: function () {
    var merc = new SphericalMercator({size: 256})
    var delta = merc.ll( [this.state.movePixel, 0], this.state.zoomValue)
    var lat = Number(this.state.lat)
    lat += (180+delta[0])
    this.setState(update(this.state, {
      lat: {$set: lat}
    }))
  },
  render: function () {
    var tiler = new MapTheTiles({width: 500, height: 500})
    var merc = new SphericalMercator({size: 256})
    var mercCenter = merc.forward([this.state.lon, this.state.lat ])
    var tiles = tiler.getTiles(mercCenter, this.state.zoomValue)
    var tilesImgs
    var baseUrl = 'http://tile.openstreetmap.org'
    if (tiles) {
      tilesImgs = tiles.map (function (tile) {
        //https://facebook.github.io/react/tips/inline-styles.html
        var imgStyle = {
          left: tile.left+'px',
          top: tile.top+'px',
          position: 'absolute'
        }
        return (
          <div style={imgStyle}>
            <img src={baseUrl+'/'+tile.z+'/'+tile.x+'/'+tile.y+'.png'} />
          </div>
        )
      })
    }

    var markerText = '\u2605'
    var marker = <div id="geoMapMarker">
                    <span><b>{markerText}</b></span>
                  </div>
             
    var copyrightInfo = <div id="geoMapCopyright">
                    <span>© <a href="//www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</span>
                  </div>
    var copyrightInfo2 = <div id="geoMapCopyright2">
                    <span>Map Data by <a href='http://tile.openstreetmap.org/'>OSM Tiles</a>,</span>
                    <br></br>
                    <span>Search coordinates via <a href='http://nominatim.openstreetmap.org/search'>OSM Nominatim</a>,</span>
                    <br></br>
                    <span>Inspired by <a href='http://maps-on-blackboard.com/articles/osm-tiles-map-with-rotation/'>Map Tiles</a> </span>
                  </div>              
             
    var searchInput
    if (this.props.editionMode) {
      searchInput = <input type="text" onChange={this.onSearchInputChange} value={this.state.searchValue}/>  
    }

    var searchButton
    if (this.props.editionMode) {
      searchButton = <input type="button" onClick={this.onSearchButtonClick} value="Wyszukaj" />
    }

    var saveButton
    if (this.props.editionMode) {
      saveButton = <input type="button" onClick={this.onSaveButtonClick} value="Zapisz pozycję" />
    }
    var zoomOutButton = <input id="geoMapZoomOutButton" type="button" onClick={this.onZoomOutButtonClick} value="-" />
    var zoomInButton = <input id="geoMapZoomInButton" type="button" onClick={this.onZoomInButtonClick} value="+" />
    var leftButton = <input type="button" onClick={this.onLeftClick} value="L" />
    var rightButton = <input type="button" onClick={this.onRightClick} value="R" />
    var upButton = <input type="button" onClick={this.onUpClick} value="U" />
    var downButton = <input type="button" onClick={this.onDownClick} value="D" />

    var navigationTable
    if (this.props.editionMode) {
      navigationTable = <table id="geoMapNavigationTable"><tbody>
        <tr>
          <td className="geoMapNavigationTableTd" ></td>
          <td className="geoMapNavigationTableTd" >{upButton}</td>
          <td className="geoMapNavigationTableTd" ></td>
        </tr>
        <tr>
          <td className="geoMapNavigationTableTd" >{leftButton}</td>
          <td className="geoMapNavigationTableTd" ></td>
          <td className="geoMapNavigationTableTd" >{rightButton}</td>
        </tr>
        <tr>
          <td className="geoMapNavigationTableTd" ></td>
          <td className="geoMapNavigationTableTd" >{downButton}</td>
          <td className="geoMapNavigationTableTd" ></td>
        </tr>
      </tbody></table>
    }

    var position
    if (this.props.editionMode) {
      //http://stackoverflow.com/questions/6134039/format-number-to-always-show-2-decimal-places
      var formattedLon = parseFloat(this.state.savedLon).toFixed(4)
      var formattedLat = parseFloat(this.state.savedLat).toFixed(4)
      position = <span id="geoMapPosition" >Zapisana pozycja: Sz:{formattedLat}, Dł:{formattedLon} </span>
    }

    return ( 
      <div>
        {searchInput}
        {searchButton}
        {saveButton}
        <br></br>
        {position}
        <div id="geoMap">
            {zoomOutButton}
            {zoomInButton}
            {navigationTable}
            {marker}
            <div id="tiles">
              {tilesImgs}
            </div>
            {copyrightInfo}
        </div>
        {copyrightInfo2}

      </div>
    )
  }
})

/* Module.exports instead of normal dom mounting */
module.exports = GeoMap