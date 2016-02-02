//http://maps-on-blackboard.com/articles/osm-tiles-map-with-rotation/
var React = require('react')
var MapTheTiles = require('map-the-tiles');
var SphericalMercator = require('sphericalmercator');

var update = require('react-addons-update')

var GeoMap = React.createClass({

  getInitialState: function() {
    var that = this
    return {
      lon: that.props.initialPosition[1],
      lat: that.props.initialPosition[0],
      savedLon: that.props.initialPosition[1],
      savedLat: that.props.initialPosition[0],
      searchValue: "Kraków Kanonicza 14",
      zoomValue: 18,
      movePixel: 5,
    }
  },

  onSearchInputChange: function (event) {
    var modifiedState = this.state;
    modifiedState.searchValue = event.currentTarget.value;
    this.setState(modifiedState);
  },

  onSearchButtonClick: function () {
    var input = this.state.searchValue;     //np. "Kraków Kanonicza 14"
    //https://pl.wikipedia.org/wiki/Znaki_diakrytyczne
    output =  input.toLowerCase()
                    .trim()
                    .replace("ą", "a")
                    .replace("ć", "c")
                    .replace("ę", "e")
                    .replace("ł", "l")
                    .replace("ń", "n")
                    .replace("ó", "o")
                    .replace("ś", "s")
                    .replace("ź", "z")
                    .replace("ż", "z");
    
    //http://wiki.openstreetmap.org/wiki/Nominatim
    var query = output;
    var searchBaseUrl = 'http://nominatim.openstreetmap.org/search.php?q=';
    var searchParams='&format=json'
    var that = this;

    var searchUrl = searchBaseUrl+query+searchParams;
    var request = new XMLHttpRequest()
    request.open('GET', searchUrl, true)
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var resp = request.responseText;
        console.log(resp);
        var json = JSON.parse(resp)

        var modifiedState = that.state;
        modifiedState.lat = json[0].lat;
        modifiedState.lon = json[0].lon;
        that.setState(modifiedState);
      } else {
        // We reached our target server, but it returned an error
      }
    }

    request.onerror = function() {
      // There was a connection error of some sort
    }

    request.send();
  },
  
  onSaveButtonClick: function () {
    this.props.saveFunction([this.state.lat, this.state.lon]);
    this.setState(update(this.state, {
      savedLon: {$set: this.state.lon},
      savedLat: {$set: this.state.lat}
    }))
  },
  
  onZoomInButtonClick: function () {
    var modifiedState = this.state;
    if (modifiedState.zoomValue < 20) {
      modifiedState.zoomValue++;
    }
    this.setState(modifiedState);
  },
  
  onZoomOutButtonClick: function () {
    var modifiedState = this.state;
    if (modifiedState.zoomValue > 0) {
      modifiedState.zoomValue--;
    }
    this.setState(modifiedState);
  },
  
  onLeftClick: function () {
    var merc = new SphericalMercator({size: 256});
    var delta = merc.ll( [this.state.movePixel, 0], this.state.zoomValue);
    console.log('Delta', delta);
    var modifiedState = this.state;
    modifiedState.lon = Number(modifiedState.lon)
    modifiedState.lon -= (180+delta[0]);
    this.setState(modifiedState);
    
  },
  
  onRightClick: function () {
    var merc = new SphericalMercator({size: 256});
    var delta = merc.ll( [this.state.movePixel, 0], this.state.zoomValue);
    console.log('Delta', delta);
    var modifiedState = this.state;
    modifiedState.lon = Number(modifiedState.lon)
    modifiedState.lon += (180+delta[0]);
    this.setState(modifiedState);
    
  },
  
  onUpClick: function () {
    var merc = new SphericalMercator({size: 256});
    var delta = merc.ll( [this.state.movePixel, 0], this.state.zoomValue);
    console.log('Delta', delta);
    var modifiedState = this.state;
    modifiedState.lat = Number(modifiedState.lat)
    modifiedState.lat += 180+delta[0];
    this.setState(modifiedState);
    
  },
  
  onDownClick: function () {
    var merc = new SphericalMercator({size: 256});
    var delta = merc.ll( [this.state.movePixel, 0], this.state.zoomValue);
    console.log('Delta', delta);
    var modifiedState = this.state;
    modifiedState.lat = Number(modifiedState.lat)
    modifiedState.lat -= (180+delta[0]);
    this.setState(modifiedState);
    
  },
  
  render: function () {
    console.log('RENDER LAT', this.state.lat)
    console.log('RENDER LON', this.state.lon)
    
    var tiler = new MapTheTiles({width: 500, height: 500});
    var merc = new SphericalMercator({size: 256});
    var mercCenter = merc.forward([this.state.lon, this.state.lat ]);
    var tiles = tiler.getTiles(mercCenter, this.state.zoomValue);
    var tilesImgs;
    var baseUrl = 'http://tile.openstreetmap.org';
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
  
    var markerText = '\u2605';
    var marker = <div id="geoMapMarker">
                    <span><b>{markerText}</b></span>
                  </div>
                  
    var copyrightInfo = <div id="geoMapCopyright">
                    <span><a href='http://maps-on-blackboard.com/articles/osm-tiles-map-with-rotation/'>Map Tiles</a> © <a href="//www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</span>
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
      var formattedLon = parseFloat(Math.round(this.state.savedLon*100)/100).toFixed(2);
      var formattedLat = parseFloat(Math.round(this.state.savedLat*100)/100).toFixed(2);
      position = <span>Sz:{formattedLat}, Dł:{formattedLon} </span>
    }
    
    return ( 
      <div>
        {searchInput}
        {searchButton}
        {saveButton}
        {position}
        <div id="mapArea">
            {zoomOutButton}
            {zoomInButton}
            {navigationTable}
            <div id="tilesContainer">
              {tilesImgs}
            </div>
            {marker}
            {copyrightInfo}
        </div>
      </div>
    )
  }
  
})

/* Module.exports instead of normal dom mounting */
module.exports = GeoMap