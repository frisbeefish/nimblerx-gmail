/**
 * @file
 * js/controllers/gmail_controller.js
 *
 * This is the component with all of the logic required to log into Google (via OAuth) and access the logged in user's
 * GMail inbox. NOTE: There is an "outbox" that is used as an offline cache for those times when a user sends emails
 * but their network is offline.
 */


//
// NOTE: This isn't checked in to git. You'll need to create your own file in public/js/config.js that has
// the Google Oauth Client id and API key for accessing the Gmail API.
//
import {clientId,apiKey} from "../config.js";

const scopes = 'https://www.googleapis.com/auth/gmail.readonly ' + 'https://www.googleapis.com/auth/gmail.send';


function getMessageHeader(messageHeaders, key) {
   let headerValue = null;

   messageHeaders.forEach((header) => {
      if (header.name === key) {
         headerValue = header.value;
      }
   });

   return headerValue;
}

function getMessageBody(message) {
   let encodedBody = '';

   function getHTMLPart(arr) {

      for (let x = 0; x <= arr.length; x++) {
         if ( typeof arr[x].parts === 'undefined' ) {
            if ( arr[x].mimeType === 'text/html' ) {
               return arr[x].body.data;
            }
         } else {
            return getHTMLPart(arr[x].parts);
         }
      }
      return '';
   }

   if ( typeof message.parts === 'undefined' ) {
      encodedBody = message.body.data;
   } else {
      encodedBody = getHTMLPart(message.parts);
   }
   encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
   return decodeURIComponent(escape(window.atob(encodedBody)));


   if ( typeof message.parts === 'undefined' ) {
      encodedBody = message.body && message.body.data; //'none' //message.body.data;
      encodedBody = encodedBody || 'missing';
   } else {
      encodedBody = getHTMLPart(message.parts);
   }
   encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');

  return encodedBody;
}


function parseMessageDetails(message) {
   let parsedMessage = {
      from:getMessageHeader(message.payload.headers,'From'),
      subject:getMessageHeader(message.payload.headers,'Subject'),
      date:getMessageHeader(message.payload.headers,'Date'),
      body:getMessageBody(message.payload)
   }

   return parsedMessage;   
}

class GmailController {

   constructor() {
      this.outbox = [];
   }

   //
   // This function authorizes the user with Google as long as they are currently logged in to GMail. But if the
   // user isn't logged in to GMail, this will fail and the user will need to click a "Log In" button in order
   // to log in using a popup dialog.
   //
   authorizeUser() {

      return new Promise( function (resolve,reject) {

         //
         // First, set the api key. Wait for it to stick.
         //
         gapi.client.setApiKey(apiKey);
         window.setTimeout(_ => {
            authorizeUser();
         }, 1);

         //
         // Then, authorize the user (OAuth login, get the user to accept, etc.)
         //
         var authorizeUser = () => {
            gapi.auth.authorize({
              client_id: clientId,
              scope: scopes,
              immediate: true
            }, handleAuthResult);
         }
        
         //
         // Now, Google has authenticated the user or not. If there was an error, the user must log in
         // via a popup hosted by Google..
         //
         var handleAuthResult = (authResult) => {
            if (authResult && !authResult.error) {
               console.log('you are authorized');
               loadGmailApi();
            } else {
               //
               // We have a problem! The user will need to log in using the GMail popup dialog.
               //
               reject();
            }
         }

         var loadGmailApi = () => {
            gapi.client.load('gmail', 'v1', _ => {
               resolve(true);
            });
         }
      });
   }

   //
   // This is only called after the application has attempted to automatically authenticate the user with Google/GMail.
   // The only time this method is called is when the user tries to "Authorize with Google" but that fails because
   // the user isn't logged in to GMail. If that failure occurs, the user is taken to a new screen with a
   // "Log In" button. The user can click that button in order to see GMail's log in pop up.
   //
   logUserIn() {
      return new Promise( function (resolve,reject) {

         //
         // First, set the api key. Wait for it to stick.
         //
         gapi.client.setApiKey(apiKey);
         window.setTimeout(_ => {
            authorizeUserShowUserLoginForm();
         }, 1);
        
         //
         // This version is necessary for when the user isn't logged in. It causes the log in popup to show.
         //
         var authorizeUserShowUserLoginForm = () => {
           gapi.auth.authorize({
             client_id: clientId,
             scope: scopes,
             immediate: false
           }, handleAuthResult);
           return false;
         }

         //
         // Now, Google has authenticated the user.
         //
         var handleAuthResult = (authResult) => {
            if (authResult && !authResult.error) {
               console.log('you are authorized');
               loadGmailApi();
            } else {
               alert('Unexpected Error! - ' + authResult.error);
            }
         }

         var loadGmailApi = () => {
            gapi.client.load('gmail', 'v1', _ => {
               resolve(true);
            });
         }
      });
   }

   getPageOfMessages (start, limit=10) {
      return new Promise( function (resolve,reject) {

         let messages = [];

         let getMessagesRequest = gapi.client.gmail.users.messages.list({
            'userId': 'me',
            'labelIds': 'INBOX',
            'maxResults': limit
         });

         getMessagesRequest.execute( (response) => {
            let numberOfMessageDetailsToFetch = response.messages.length;
            let messageIdToArrayIndexMap = {};

            response.messages.forEach ( (message,messageIndex) => {

               //
               // We put each message "stub" here. This means that "messages" will contain newest to oldest messages
               // in the same order as you'd see them at gmail.com. Later, we'll retrieve the details for each message.
               // When we do that, those details need to be put into the correct position/slot in "messages."
               //
               messages.push(message);

               let messageDetailsRequest = gapi.client.gmail.users.messages.get({
                  'userId': 'me',
                  'id': message.id
               });

               messageDetailsRequest.execute( (messageDetails) => {

                  //
                  // Replace the stub with the retrieved message. This allows us to get message details at different times
                  // (some take longer than others), but the message-with-details are in the same order as the original
                  // list we retrieved.
                  //
                  messages[messageIndex] = parseMessageDetails(messageDetails)
                  
                  numberOfMessageDetailsToFetch -= 1;
                  if (numberOfMessageDetailsToFetch === 0) {
                     resolve(messages);
                  }
               }); 

            });
         });  

      }); // promise
   } 

   enqueueEmailToBeSent(email) {
      this.outbox.push(email);
   }

   sendQueuedEmails() {
      
      //
      // Bind the promise function to "this"
      //
      return new Promise( (resolve,reject) => {

         if (this.outbox.length === 0) {
            setTimeout( _ => resolve(), 0);
         } else {
            let promises = [];

            //
            // Clone the outbox.
            //
            let outbox = this.outbox.slice();
            this.outbox.length = 0;

            //
            // Work from the clone. Create promises for each email that needs to be sent. These promises will
            // send the emails. 
            //
            outbox.forEach( (email) => {
               promises.push(this.sendEmail(email));
            });

            //
            // Now, once all the emails have been sent, call the "resolve" function - so the client controller
            // knows the send is done.
            //
            Promise.all(promises).then(function(values) { 
               resolve();
            });
         }
      });
   }

   sendEmail(email) {
      return new Promise( function (resolve,reject) {
         
         //
         // Create the email.
         //
         let emailContent = 'To: ' + email.to + '\r\n' + 'Subject: ' + email.subject + '\r\n';
         emailContent += '\r\n' + email.body;

         var sendRequest = gapi.client.gmail.users.messages.send({
            'userId': 'me',
            'resource': {
               'raw': window.btoa(emailContent).replace(/\+/g, '-').replace(/\//g, '_')
            }
         });

         //
         // Send the email.
         //
         sendRequest.execute( _ => {
            resolve();
         });
      });
   }

}

export {GmailController}

