/**
 * @file
 * js/views/login_view.jsx
 *
 * This view shows a button that the user clicks in order to access GMail. When the user clicks the "Log In" button,
 * they will be presented with Google's login dialog.
 */

import React from 'react';
import ReactDOM from 'react-dom';

class LoginView extends React.Component {  
   
   render() {
      return (
          <div className="login-view">
             You are not currently logged in to GMail. Please click the button below.
             <br/>
             <br/>
             <button type="button" className="btn btn-primary btn-lg" onClick={this.props.onHandleLogIn}>Log In</button>
          </div>
      )
   }
}

export {LoginView};