# nimblerx-gmail
This is a ES6, ReactJS, Gmail API web app that lets you read your inbox and compose emails. This is just a toy. 

NOTE: It supports offline mode. If you disconnect your network, the client still allows you to reply to emails
and to compose new ones. Once network connectivity returns, the app will send any emails that you tried to
send while the network was off. It will also re-retrieve the top 10 items from your inbox.

You can try it live here: https://still-plains-48636.herokuapp.com

NOTE: Sometimes Chrome and Firefox will throw errors if you go from online to offline to online. These are due to google's Email API detecting that you are now on a new network. So Chrome and Firefox are really sensitive to that situation. Safari doesn't seem to be as sensitive to it.
