var React = require('react')
var vis = require('vis');
var uuid = require('uuid');

var IDENTIFIER;

module.exports = React.createClass({

  componentWillMount: function(){
    IDENTIFIER = this.props.identifier ?  this.props.identifier : uuid.v4();
  },
  componentDidMount: function() {
    this.updateGraph();
  },

  componentDidUpdate: function() {
    this.updateGraph();
  },

  updateGraph: function() {
    var container = document.getElementById(IDENTIFIER);
    var options = {
      stabilize: false,
      smoothCurves: false,
      edges: {
        color: '#000000',
        width: 0.5,
        arrowScaleFactor: 0.5,
        style: 'arrow'
      }
    };
    var moveToOptions = {
      position: {x:0, y:0},
      scale: 0.5,
      animation: {
          duration: 1000,
          easingFunction: "easeInOutQuad"
      }
    }

    var network = new vis.Network(container, this.props.graph, this.props.options || options);
    var onClick = this.props.clickFunc;
    if(this.props.moveToCenter != false) setTimeout(function(){network.moveTo(moveToOptions)}, 2000)
    network.on("click", function(params){
      onClick(params);
    });
  },

  render: function() {
    var style = this.props.style;
    return React.createElement('div', {id: IDENTIFIER, style});
  }
})