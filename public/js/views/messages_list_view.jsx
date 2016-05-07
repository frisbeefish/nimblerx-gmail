/**
 * @file
 * js/views/messages_list_view.jsx
 *
 * This view shows the most recent 10 emails from the user's GMail inbox.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

class MessagesListRow extends React.Component {

    handleClick(event) {
      //alert('clicked me');
       this.props.onSelectedRow(this.props.message);
    }

    render() {
       let messageDate = moment(this.props.message.date).format('dddd MMM DD, YYYY h:m a')
        return (
           <tr className="message-list-row" onClick={this.handleClick.bind(this)} >
             <td >{this.props.message.from}</td>
             <td>{this.props.message.subject}</td>
             <td>{messageDate}</td>
           </tr>
       )
    }
}

class MessagesListView extends React.Component {

    handleSelectedRow(message) {
       this.props.onShowEmailDetails(message);
    }

    render() {

         var messages = this.props.messages.map( (message,idx) => {
            return (
               <MessagesListRow 
                  key={idx} 
                  message={message}
                  onSelectedRow={this.handleSelectedRow.bind(this)} />
            )
         })

        return (
          <table className="table table-striped">
             <thead>
                <tr>
                   <th>From</th>
                   <th>Subject</th>
                   <th>When</th>
                </tr>
             </thead>
             <tbody>
               {messages}
             </tbody>
          </table>
        )
    }
}

export {MessagesListView};


