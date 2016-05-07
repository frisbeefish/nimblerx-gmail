# nimblerx-gmail
This is a ES6, ReactJS, Gmail API web app that lets you read your inbox and compose emails. This is just a toy. 
 

Features:

   * Online/Offline: You can reply to emails and compose/send emails even when the app is offline. (Just make sure to turn network back on eventually!)

   * Support for displaying "plain text" and "html" emails

   * Good example of how to use the client-side, all-JavaScript Google APIs for auth + reading/sending emails.

   * Completely "component base" app structure.


You can try it live here: [https://still-plains-48636.herokuapp.com](https://still-plains-48636.herokuapp.com){:target="_blank"}
 



NOTE #1: It supports offline mode. If you disconnect your network, the client still allows you to reply to emails
and to compose new ones. Once network connectivity returns, the app will send any emails that you tried to
send while the network was off. It will also re-retrieve the top 10 items from your inbox.

NOTE #2: Please be gentle with the online/offline stuff. It ends up that if you turn off your wifi, it takes 10 or 20 seconds before the browser knows you are offline. So to try this out, please load the web app, then do stuff. Then eventually turn off your wifi. And wait until you see an image in the upper right-hand corner of the web indicating 
that the network is offline. When you see this, the app has been told by the browser that the network is gone. At the point
that you see the image you can try to reply to messages and/or compose new messages. When you click "Send" with the network offline, your messages will be stored in an "outbox" queue in the browser's memory. Then if you turn wifi back on (and the network is again accessible), the browser will flush/send any outbound emails it finds in the oubox. And then finally the app will re-retrieve the latest 10 messages from your email inbox.



NOTE: Sometimes Chrome and Firefox will throw errors if you go from online to offline to online. These are due to google's Email API detecting that you are now on a new network. So Chrome and Firefox are really sensitive to that situation. Safari doesn't seem to be as sensitive to it.
