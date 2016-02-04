var React = require('react')
//var Formsy = require('formsy-react')

var ProfileImage = React.createClass({

  defaultProfileImg : '/img/profile-100x100.jpg',

  getInitialState : function() {
    
    return {
      //srcImage: this.defaultProfileImg
    };
  },
  
  render: function () {
    
    // Initial state of avatar
    var srcImg = (("midi" === this.props.size) ? this.props.srcMidi :  this.props.srcMini);
    if( '' === srcImg || undefined === srcImg ) srcImg = this.defaultProfileImg;
    
    
    
    
    var classNameImg = 'avatar-img',
        classNameWrapper = 'avatar avatar-size-'+this.props.size;

    return (
      <div className={classNameWrapper} >
        <img  
          src={srcImg}
          className={classNameImg}
          alt=""/>
      </div>
    )
  }
})

module.exports = ProfileImage
