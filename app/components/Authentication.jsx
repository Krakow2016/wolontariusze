var React = require('react')
var NavLink = require('fluxible-router').NavLink
var FormattedMessage = require('react-intl').FormattedMessage

var Authentication = React.createClass({

  getInitialState: function(){
    var state = {
      open: false
    }
    return state
  },

  onClicked: function(){
    this.setState({
      open: !this.state.open
    })
  },

  render: function () {
    var loginButton
    var classname
    if (this.props.user_name) {
      loginButton = <LogoutButton
        user_id={this.props.user_id}
        user_name={this.props.user_name}
        open={this.state.open}
        onClicked={this.onClicked} />
    } else {
      loginButton = <LoginButton 
        open={this.state.open}
        onClicked={this.onClicked} />
    }

    if(this.props.search_status){
      classname = 'col col9 head-section'
    }else{
      classname = 'col col12 head-section'
    }

    return (
      <div className={classname}>
        {loginButton}
      </div>
    )
  }
})

var LoginButton = React.createClass({

  render: function() {
    var open = this.props.open ? "open" : "";
    return (
      <div>
        <div id="overlay" className={open} onClick={this.props.onClicked}></div>
        <div id="mobile-nav">
          <a href="#" className="menu-mobile-btn" onClick={this.props.onClicked}><img src="/img/menu.svg" /></a>
          <div id="mobile-nav-content" className={open} onClick={this.props.onClicked}>
            <NavLink href="/login"><FormattedMessage id="login" /></NavLink>
            <a href="/faq">FAQ</a>
          </div>
        </div>
        <ul id="nav-list">
          <li>
            <NavLink href="/login">
              <FormattedMessage id="login" />
            </NavLink>
          </li>
          <li>
            <a href="/faq">FAQ</a>
          </li>
        </ul>
      </div>
    )
  }
})

var LogoutButton = React.createClass({

  render: function() {
    var open = this.props.open ? "open" : "";
    return (
      <div>
        <div id="overlay" className={open} onClick={this.props.onClicked}></div>
        <div id="mobile-nav">
          <a href="#" className="menu-mobile-btn" onClick={this.props.onClicked} ><img src="/img/menu.svg" alias="Menu Button"/></a>
          <div id="mobile-nav-content" className={open} onClick={this.props.onClicked}>
            <NavLink href="/zadania"><FormattedMessage id="bank" /></NavLink>
            <NavLink href={'/wolontariusz/'+this.props.user_id}><FormattedMessage id="welcome" /> <b>{this.props.user_name}!</b></NavLink>
            <NavLink href="/ustawienia"><FormattedMessage id="settings" /></NavLink>
            <a href="/logout"><FormattedMessage id="logout" /></a>
            <a href="/faq">FAQ</a>
          </div>
        </div>
        <ul id="nav-list">
          <li>
            <NavLink href="/zadania"><FormattedMessage id="bank" /></NavLink>
          </li>
          <li>
            <NavLink href={'/wolontariusz/'+this.props.user_id}><FormattedMessage id="welcome" /> {this.props.user_name}!</NavLink>
          </li>
          <li>
            <NavLink href="/ustawienia"><FormattedMessage id="settings" /></NavLink>
          </li>
          <li>
            <a href="/logout"><FormattedMessage id="logout" /></a>
          </li>
          <li>
            <a href="/faq">FAQ</a>
          </li>
        </ul>
      </div>
    )
  }
})

module.exports = Authentication
