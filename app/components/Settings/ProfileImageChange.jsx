var React = require('react')
var AWS = require('aws-sdk')
var cfgAWS = require('../../../config/aws.json')
AWS.config.update(cfgAWS.cred);
AWS.config.region = cfgAWS.region;
var Dropzone = require('react-dropzone')
var ProfileImage = require('./ProfileImage.jsx')

var ProfileImageChange = React.createClass({
  
  sizeMini : 100,
  sizeMidi : 750,

  getInitialState : function() {
    return {
      showDropzone: false,
      srcImageMini: this.props.srcMini,
      srcImageMidi: this.props.srcMidi
    };
  },
  
  changeValue: function (event) {
    this.setState({
       showDropzone: true
    }); 
  },
  
  imageS3url : function(cfg, objKey) {
        return 'https://s3.'+ cfg.region +'.amazonaws.com/' + cfg.bucketName + '/'+objKey;
  },
  
  multiple : false,
  
  resizeImage : function(file, maxWidth, maxHeight, cb) {
      
      var img = document.createElement("img"),
          reader = new FileReader();  
      
      reader.onload = function(eR) {
          
          img.onload = function(eI) {
          
              var canvas = document.createElement("canvas");
              var ctx = canvas.getContext("2d");
              ctx.drawImage(this, 0, 0);
      
              var width = this.width;
              var height = this.height;
              var dx = 0;
              var dy = 0;
              
              if (width > height) {
                if (width > maxWidth) {
                  width *= maxHeight / height;
                  height = maxHeight;
                  dx = (width - maxWidth) / -2;
                }
              } else {
                if (height > maxHeight) {
                   height *= maxWidth / width;
                   width = maxWidth;
                   dy = (height - maxHeight) / -2;
                }
              }
              canvas.width = maxWidth;
              canvas.height = maxHeight;
              var ctx = canvas.getContext("2d");
              
              ctx.drawImage(this, dx, dy, width, height);
      
              
              canvas.toBlob(cb);
          }

          img.src = eR.target.result;
          
      };
      reader.readAsDataURL(file);  
  },
      
  onDrop: function (files) { 
       
      console.log('Received files: ', files);
      var comp = this;
      var bucket = new AWS.S3({
            params: {
                Bucket: cfgAWS.bucketName
            }
      });
      
      var file = files[0];
      var ext = file.name.split('.').pop()
      
      
      comp.resizeImage( file, comp.sizeMini, comp.sizeMini, function(newImgMini) {
          var objKeyMini = cfgAWS.catalogAvatars + '/' + comp.props.id + '-' + comp.sizeMini + 'x' + comp.sizeMini + '.' + ext;
          bucket.putObject({
            Key: objKeyMini,
            ContentType: file.type, 
            Body: newImgMini,
            ACL: 'public-read-write'
          }, function (err, data) {
              if (err) {
                console.log('Bucket:putObject Mini > ERROR: ' + err);
              } else {
                  var imgUrlMini = comp.imageS3url(cfgAWS, objKeyMini);
                  
                  console.log('Bucket:putObject Mini > OK', imgUrlMini);
                  
                  comp.setState({
                    srcImageMini: imgUrlMini
                  }); 
                  
                  comp.resizeImage( file, comp.sizeMidi, comp.sizeMidi, function(newImgMidi) {
                      var objKeyMidi = cfgAWS.catalogAvatars + '/' + comp.props.id + '-' + comp.sizeMidi + 'x' + comp.sizeMidi + '.' + ext;
                      bucket.putObject({
                        Key: objKeyMidi,
                        ContentType: file.type, 
                        Body: newImgMidi,
                        ACL: 'public-read-write'
                      }, function (err, data) {
                          if (err) {
                            console.log('Bucket:putObject Midi > ERROR: ' + err);
                          } else {
                            console.log('Bucket:putObject Midi > OK');
                            
                            var imgUrlMidi = comp.imageS3url(cfgAWS, objKeyMidi);
                            
                            comp.setState({
                              srcImageMidi: imgUrlMidi
                            });
                            comp.setState({
                              showDropzone: false
                            });
                             
                          }
                      }); 
                  
                  });
                
              }
        });
      
      } );
      
  },    

  render: function () {
    
    var classNameBtn = 'btn-change-avatar' + (this.state.showDropzone && " hidden"),
        classNameWrapper = 'avatar-change avatar-change-size-'+this.props.size,
        classNameFile = "field-file hidden",
        classDropzone = "dropzone" + (!this.state.showDropzone && " hidden");
     
    return (
      <div className={classNameWrapper} >
        <ProfileImage 
            id={this.props.id}  
            srcMini={this.state.srcImageMini}
            srcMidi={this.state.srcImageMidi}
            size={this.props.size}
        />
        <div className={classNameBtn} onClick={this.changeValue}>Zmień</div>
        <Dropzone onDrop={this.onDrop} className={classDropzone}>
          <div>Upuść tu zdjęcie.</div>
        </Dropzone>
        
      </div>
    )
  }
})

module.exports = ProfileImageChange
