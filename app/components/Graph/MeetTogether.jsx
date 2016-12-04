var React = require('react')
var FormattedMessage = require('react-intl').FormattedMessage
var Graph = require('./Graph.jsx');

var DATA;
var THUMB_IMAGE = 'thumbs';
var NORMAL_IMAGE = 'images';
var IMAGES_LENGTH = 75;
var DIR = '/img/meet/' + THUMB_IMAGE + '/';
var SRC_IMAGE = '' ;
var CLASS_IMAGE = '';

module.exports = React.createClass({

  componentWillMount: function(){
    this._bigImage = {};
    var that = this;
    that.handleImages(function(images){
      that.getScaleFreeNetwork(images.length, images, function(data){
        DATA = data;
      });
    });
  },
  handleImages: function (cb) {
    var images = [];
    for (var i = 1; i <= IMAGES_LENGTH; i++) {
      var img = 'img_' + i + '.jpg';
      images.push(img);
    }
    cb(images);
  },
  getScaleFreeNetwork: function (nodeCount, images, cb) {
    var nodes = [];
    var edges = [];
    var connectionCount = [];

    // randomly create some nodes and edges
    for (var i = 0; i < nodeCount; i++) {
      nodes.push({
        id: i, shape: 'circularImage', image: DIR + images[i] //z, title: 'Jan Kowalski #'+i
        //label: String(i)
      });

      connectionCount[i] = 0;

      // create edges in a scale-free-network way
      if (i == 1) {
        var from = i;
        var to = 0;
        edges.push({ from: from, to: to });
        connectionCount[from]++;
        connectionCount[to]++;
      }
      else if (i > 1) {
        var conn = edges.length * 2;
        var rand = Math.floor(Math.random() * conn);
        var width = Math.floor((Math.random() * 11) + 3);
        var cum = 0;
        var j = 0;
        while (j < connectionCount.length && cum < rand) {
          cum += connectionCount[j];
          j++;
        }


        var from = i;
        var to = j;
        edges.push({
          from: from,
          to: to,
          width: width
        });
        connectionCount[from]++;
        connectionCount[to]++;
      }
    }
    cb({nodes:nodes, edges:edges});
  },
  render: function () {
    var moveToOptions = {
      position: { x: 0, y: 0 },
      scale: 0.5,
      animation: {
        duration: 2000,
        easingFunction: "easeInOutQuad"
      }
    }
    var options = {
      nodes: {
        borderWidth: 4,
        size: 50,
        color: {
          border: '#406897',
          background: '#6AAFFF'
        },
        font: { color: '#eeeeee' },
        shapeProperties: {
          useBorderWithImage: true
        }
      },
      edges: {
        color: '#333333',
      },
      interaction: { hover: true },
      autoResize: true,
      layout: {
      }
      // clickToUse: true
    };
    var res = null;
    if(DATA){
      res = (          
          <div id="meet-graph">
            <BigImage ref={(ref) => {this._bigImage = ref}} />
            <Graph graph={DATA} options={options} style={{width: "100%", height:"480px"}} clickFunc={this._bigImage.showImage}/>
          </div>
      );
    }
    return res;
  }
})

var BigImage = React.createClass({
  getInitialState: function() {
    return {
      class: '',
      src: ''
    }
  },
  getImageDirByNodeId: function (nodeId) {
    for (var i = 0; i < DATA.nodes.length; i++) {
      if (DATA.nodes[i].id === nodeId) {
        return DATA.nodes[i].image;
      }
    }
  },
  showImage: function (params) {
    var src = this.getImageDirByNodeId(params.nodes[0]);
    src = src.replace(THUMB_IMAGE, NORMAL_IMAGE);
    this.setState({
      class: 'show',
      src: src
    })
  },
  hideImage: function () {
    this.setState({
      class: '',
      src: ""
    })
  },
  render: function(){
    return (<div id="focused-image" className={this.state.class} onClick={this.hideImage}><img id="image" src={this.state.src} /></div>)
  }
})
