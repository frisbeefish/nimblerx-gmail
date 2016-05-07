/**
 * @file
 * js/controllers/app_controller.js
 *
 * This file contains the main application controller for the NimbleRX Gmail client. This is where the
 * "intelligence" can be found. The views are much less intelligent. And the model contains just the data that
 * drives the views.
 */

import React from 'react';
import ReactDOM from 'react-dom';

import {AppModel} from '../models/app_model.js'; 
import {AppView} from '../views/app_view.jsx'; 
import {GmailController} from './gmail_controller.js'; 

var privates = Symbol("privates");

//
// The application's main controller.
//
class AppController {

   constructor() {
      this.appModel = new AppModel();
      this.appModel.appOnline = navigator.onLine;
      this.gmailController = new GmailController();

      //
      // These are private methods that the outside world can't access but methods defined within
      // this class can access.
      //
      this[privates] = {
         displayMessages : (messages) => {
            this.appModel.messages = messages;
            this.appModel.viewState = AppModel.SHOW_MESSAGES_LIST;
            this.render();
         }
      }
   }

   //
   // This re-retrieves inbox items from GMail and then shows the inbox list.
   //
   handleGoHome() {

      //
      // Most of the time, we do the default for this method - which is to go out over the network and grab
      // the most up-to-date top 10 items in the user's GMail inbox...
      //
      if (navigator.onLine) {
         this.getAndShowPageOfMessages();

      //
      // But! If the browser isn't online, then going out to GMail would fail. So instead, we simply return the
      // user to a view of the list of inbox messages that is in memory from the last time we successfully
      // grabbed emails from GMail.
      //
      } else {
         this.appModel.viewState = AppModel.SHOW_MESSAGES_LIST;
         this.render();
      }
   }

   //
   // This just shows the in-memory inbox list we got from GMail some time in the past. (NOTE: This doesn't go
   // out to GMail for a refreshed view of the inbox.)
   //
   handleGoHomeNoRefresh() {
      this.appModel.viewState = AppModel.SHOW_MESSAGES_LIST;
      this.render();
   }

   //
   // The user clicked the "Log In to Gmail" button. Log the user in using Google's OAuth API and the 
   // Email API.
   //
   // This function does 2 things:
   //    1. Log the user in.
   //    2. Grab the top 10 items from their GMail inbox.
   //
   handleAuthorize() {
      this.gmailController.authorizeUser().then( () => {
          return this.gmailController.getPageOfMessages();
      }).then( (messages) => {
         this.appModel.userIsLoggedIn = true;
         this[privates].displayMessages(messages);

      //
      // An error indicates that the user isn't currently logged in to GMail. We'll now
      // send them to a page that will allow them to log in via a popup.
      //
      }).catch( () => {
         this.appModel.viewState = AppModel.LOG_IN;
         this.render();
      })
   }

   //
   // The user clicked the "Log In to Gmail" button. Log the user in using Google's OAuth API and the 
   // Email API.
   //
   // This function does 2 things:
   //    1. Log the user in.
   //    2. Grab the top 10 items from their GMail inbox.
   //
   handleLogIn() {
      this.gmailController.logUserIn().then( () => {
          return this.gmailController.getPageOfMessages();
      }).then( (messages) => {
         this.appModel.userIsLoggedIn = true;
         this[privates].displayMessages(messages);
      })
   }

   //
   // This goes out to GMail, retrieves a fresh view of the top 10 messages in the user's inbox and then shows
   // those to the screen in a list.
   //
   getAndShowPageOfMessages() {
      this.gmailController.getPageOfMessages().then( (messages) => {
         this[privates].displayMessages(messages);
      })      
   }

   //
   // The user clicked an email. Show it in detailed view.
   //
   handleShowEmailDetails(message) {
      this.appModel.selectedMessage = message;
      this.appModel.viewState = AppModel.VIEW_MESSAGE;
      this.render();
   }

   //
   // The user clicked the "Compose Email" link along the top navigation. Show a "Compose Email" form.
   //
   handleComposeEmail() {
      this.appModel.viewState = AppModel.COMPOSE_MESSAGE;
      this.render();
   }

   //
   // The user was replying to an email but cancelled that activity. We want to bring the user back to the
   // original email they wanted to reply to.
   //
   handleCancelReplyMessage() {
      this.appModel.viewState = AppModel.VIEW_MESSAGE;
      this.render();
   }

   //
   // The user was viewing an email from their inbox and clicked the "Reply" button. We will show the user
   // a screen that allows them to reply to the email.
   //
   handleReplyToEmail() {
      this.appModel.viewState = AppModel.REPLY_TO_MESSAGE;
      this.render();
   }

   //
   // The user clicked the "Send" button from the Compose/Reply form. If the browser is "offline" (the network is off),
   // then the email the user is sending will be saved in a local queue (from which it will be sent once the computer's
   // network comes back online). But if the user's computer is online (network is working), then this will send the
   // email. Once the email is sent, this re-retrieves the user's inbox from GMail and shows those messages to the
   // user in a list.
   //
   handleSendEmail(email) {

      //
      // If we are online, send the email over the newwork...
      //
      if (navigator.onLine) {
        
         this.gmailController.sendEmail(email).then( () => {
             this.handleGoHome();
         })


      //
      // Otherwise, we'll queue it (into an outbox) and send it later.
      //
      } else {
         this.gmailController.enqueueEmailToBeSent(email);
         this.handleGoHome();
      }
   }

   //
   // Each time this is called, the application's UI is re-rendered (based on the model).
   //
   render() {
      ReactDOM.render(
         <AppView 
            messages={this.appModel.messages} 
            selectedMessage={this.appModel.selectedMessage}
            app={this.appModel.app}
            appIsOnline={this.appModel.appOnline}
            userIsLoggedIn={this.appModel.userIsLoggedIn}
            onGoHome={this.handleGoHome.bind(this)}
            onGoHomeNoRefresh={this.handleGoHomeNoRefresh.bind(this)}
            onCancelReplyMessage={this.handleCancelReplyMessage.bind(this)}
            onHandleLogIn={this.handleLogIn.bind(this)}
            onHandleAuthorize={this.handleAuthorize.bind(this)}
            onShowEmailDetails={this.handleShowEmailDetails.bind(this)}
            onComposeEmail={this.handleComposeEmail.bind(this)}
            onReplyToEmail={this.handleReplyToEmail.bind(this)}
            onSend={this.handleSendEmail.bind(this)} />,
            document.getElementById('app')
      );
   }

   init() {    

      ////////////////////////////////////////////
      //
      // Respond to online/offline state.
      //
      ////////////////////////////////////////////

      //
      // Once the app comes back online, remove the message at the right of top nav, send any pending outbound messages and
      // then retrieve the inbox of messages again.
      //
      var appIsOnline = () => {
         this.appModel.appOnline = true;

         //
         // Now that we're back online, flush the outbox (send emails that were composed and sent while
         // the browser was offline).
         //
         this.gmailController.sendQueuedEmails().then( () => {

            //
            // Now that all emails that had been in the outbox have been sent, lets re-retrieve the inbox.
            //
            this.getAndShowPageOfMessages();
         })
         
      }
      var appIsOffline = () => {
         this.appModel.appOnline = false;
         this.render();
      }
      window.addEventListener('online',  appIsOnline);
      window.addEventListener('offline', appIsOffline);

      //
      // Show the first view.
      //
      this.render();
   }
}

export {AppController}

