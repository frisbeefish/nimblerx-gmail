/**
 * @file
 * js/views/app_view.jsx
 *
 * This is the main view of the entire application. It generates the appropriate page views based on the current
 * state of the application.
 */

import React from 'react';
import ReactDOM from 'react-dom';

import {Navbar} from '../viewcomponents/navbar.jsx'; 
import {AuthorizeView} from './authorize_view.jsx'; 
import {LoginView} from './login_view.jsx'; 
import {SingleMessageView} from './single_message_view.jsx'; 
import {ComposeMessageView} from './compose_message_view.jsx'; 
import {MessagesListView} from './messages_list_view.jsx'; 
import {AppModel} from '../models/app_model.js'; 


class AppView extends React.Component {

   render() {

      //
      // Create the mage page view that sits below the top nav. This view is different based on what state the
      // applicaion is in (such as: showing the inbox list, composing a new email, viewing an email, etc.)
      //
      let mainContent = (() => {
         switch(this.props.app.viewState) {

            case AppModel.AUTHORIZE_WITH_GMAIL:
                  return (
                     <AuthorizeView onHandleLogIn={this.props.onHandleAuthorize} />
                  )
            case AppModel.LOG_IN:
                  return (
                     <LoginView onHandleLogIn={this.props.onHandleLogIn} />
                  )
            case AppModel.SHOW_MESSAGES_LIST:
                  return (
                     <MessagesListView  messages={this.props.messages}
                        onShowEmailDetails={this.props.onShowEmailDetails} />
                  )
            case AppModel.VIEW_MESSAGE:
                  return (
                     <SingleMessageView message={this.props.selectedMessage}
                                        onReplyToEmail={this.props.onReplyToEmail}
                                        onCancel={this.props.onGoHomeNoRefresh} />
                  )
            case AppModel.COMPOSE_MESSAGE:
                  return (
                     <ComposeMessageView onSend={this.props.onSend}
                                         onCancel={this.props.onGoHomeNoRefresh} />
                  )
            case AppModel.REPLY_TO_MESSAGE:
                  return (
                     <ComposeMessageView message={this.props.selectedMessage}
                                         onSend={this.props.onSend}
                                         onCancel={this.props.onCancelReplyMessage} />
                  )

            default:
                  alert('none created this.props.viewState: ' + this.props.viewState);
                  break;
         }
      })()

      return (
          <div>
             <Navbar appIsOnline={this.props.appIsOnline} 
                     userIsLoggedIn={this.props.userIsLoggedIn} 
                     onGoHome={this.props.onGoHome}
                     onComposeEmail={this.props.onComposeEmail} />
              {mainContent}
          </div>
      )
   }
}

export {AppView}
