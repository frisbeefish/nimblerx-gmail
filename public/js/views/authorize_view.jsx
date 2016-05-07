/**
 * @file
 * js/views/authorize_view.jsx
 *
 * This view shows a button that the user clicks in order to access GMail.
 */

import React from 'react';
import ReactDOM from 'react-dom';

class AuthorizeView extends React.Component {  
   
   render() {
      return (
          <div className="login-view">
             <button type="button" className="btn btn-primary btn-lg" onClick={this.props.onHandleLogIn}>Authorize With Google</button>
          </div>
      )
   }
}

export {AuthorizeView};