/**
 * @file
 * js/views/single_message_view.jsx
 *
 * This is a read-only view of an email item that the user has clicked on. This view supports displaying both plain text
 * and html emails.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

class SingleMessageView extends React.Component {  

   render() {
      let messageDate = moment(this.props.message.date).format('dddd MMM DD, YYYY h:m a');

      return ( 
        <div className="single-message-view">
         <header className="title">
            <h3>{this.props.message.subject}</h3>
            <button className="btn btn-link" onClick={this.props.onCancel} 
               dangerouslySetInnerHTML={{__html: '&times;'}}></button>
         </header>
         <header className="from-and-date">
            <span className="from">From: {this.props.message.from}</span>
            <span className="date">{messageDate}</span>
         </header>
         <section>
            <iframe ref="iframe" frameborder="0" ></iframe>
         </section>
         <footer>
            <button type="button" className="btn btn-primary" onClick={this.props.onReplyToEmail}>Reply</button>
         </footer>
       </div>
      )
   }

   //
   // This is invoked every time the view shows with some new email message. It is here where we hook into the DOM and
   // place html content into the iframe (which is an HTML component that is good for displaying HTML content).
   //
   componentDidMount() {
     
      let messageBody = this.props.message.body;
      let iframe = this.refs.iframe;
      let frameDoc = iframe.contentWindow.document;
     
      //
      // Place the email message's html (or plain text) body into the iframe.
      //
      frameDoc.write(messageBody);

      //
      // Give the content a while to settle. We want to resize the iframe so that it is tall enough to display all of the 
      // content without the need for a scroll bar.
      //
      setTimeout( _ => {
         let contentHeight = frameDoc.body.scrollHeight;
         iframe.height = (contentHeight + 30) + 'px';
      },100);
   }
}


export {SingleMessageView};