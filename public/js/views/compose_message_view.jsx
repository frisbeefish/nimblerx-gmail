/**
 * @file
 * js/views/compose_message_view.jsx
 *
 * This view shows a form allowing the user to compose a new email or reply to an existing one.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

class ComposeMessageView extends React.Component {  

   constructor(props) {
      super(props);
      this.state = {
        to:props.message ? props.message.from : '',
        subject:props.message ? 'Re: ' + props.message.subject : '',
        body:''
      };
   }

   //
   // The user clicked the "Send" button.
   //
   handleSend() {
      if (this.props.message) {
         let origMessageDate = moment(this.props.message.date).format('dddd MMM DD, YYYY h:m a');
         //
         // Just being lazy here directly changing the state as the form exits.
         //
         var origBody = this.state.body;
         origBody += '\r\n\r\n==================================================================';
         origBody += '\r\n\r\nOn ' + origMessageDate + ' ' + this.props.message.from + ' Sent:\r\n\r\n' + this.props.message.body;
         this.state.body = origBody;
      }
      this.props.onSend(this.state);
   }

   //
   // The user typed something into the "To:" text field. Update the local model stored in "state" to reflect what the
   // user has entered.
   //
   handleChangeTo(evt) {
      this.setState({
         to: evt.target.value
      });
   }

   //
   // The user typed something into the "Subject:" text field. Update the local model stored in "state" to reflect what the
   // user has entered.
   //
   handleChangeSubject(evt) {
      this.setState({
         subject: evt.target.value
      });
   }

   //
   // The user typed something into the "Body:" text field. Update the local model stored in "state" to reflect what the
   // user has entered.
   //
   handleChangeBody(evt) {
      this.setState({
         body: evt.target.value
      });
   }

  render() {

    let title = this.props.message ? 'Reply' : 'Compose New Email';

    return (
       <div className="compose-message-view">
       <header className="title">
          <h3>{title}</h3>
          <button className="btn btn-link" onClick={this.props.onCancel} 
             dangerouslySetInnerHTML={{__html: '&times;'}}></button>
       </header>
       <header className="to">
          <input id="to" name="to" className="form-control" type="text" 
             placeholder="To:" value={this.state.to} onChange={this.handleChangeTo.bind(this)} />
       </header>
       <header className="subject">
          <input id="subject" name="subject" className="form-control" type="text" 
             placeholder="Subject:" value={this.state.subject} onChange={this.handleChangeSubject.bind(this)} />
       </header>
       <section>
          <textarea id="body" name="body" className="form-control" 
             placeholder="Your message here..." value={this.state.body} onChange={this.handleChangeBody.bind(this)}  ></textarea>
       </section>
       <footer>
          <button type="button" className="btn btn-default" onClick={this.props.onCancel}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={this.handleSend.bind(this)}>Send</button>
       </footer>
    </div>
     )
  }
}


export {ComposeMessageView};