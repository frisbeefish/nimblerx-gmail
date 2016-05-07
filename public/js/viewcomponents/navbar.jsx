/**
 * @file
 * js/viewcomponents/navbar.jsx
 *
 * This is the top navigation bar of the application.
 */

import React from 'react';
import ReactDOM from 'react-dom';


class Navbar extends React.Component {

   render() {

      //
      // Show the "app is offline" message in the upper right of the app or not?
      //
      let offlineMessageCssClass = 'offline-message ' + (this.props.appIsOnline ? 'hidden' : '');

      //
      // Only if the user is logged in do we show the "Compose Email" link in the top nav.
      //
      let composeLink = this.props.userIsLoggedIn ? (
         <li className="compose-email-link"><a href="JavaScript:void(0)" onClick={this.props.onComposeEmail}>Compose Email</a></li>
      ) : null;

      return (
          <nav className="navbar navbar-inverse navbar-fixed-top">
            <div className="container">
              <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="JavaScript:void(0);" onClick={this.props.onGoHome}>NimbleRX Gmail</a>
              </div>
              <div id="navbar" className="collapse navbar-collapse">
                <ul className="nav navbar-nav">
                  <li className="active"><a href="JavaScript:void(0);" onClick={this.props.onGoHome}>Home</a></li>
                  {composeLink}
                </ul>
              </div>
            </div>
            <div className={offlineMessageCssClass}>App is Offline! <div className="red-dot"></div></div>
          </nav>
      )
   }
}

export {Navbar}

