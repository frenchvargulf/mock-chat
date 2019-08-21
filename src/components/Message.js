import React, { Component } from 'react'
import './Message.css'

class Message extends Component{
    render () {
        return ( 
            <div >
                <li key={this.props.id} className="message-cnt" >
                    <p className="message-sender"> 
                        { this.props.senderId }
                    </p>
                    <p className="Message" >
                        { this.props.text } 
                    </p>
                </li>
            </div>
        );
    }
};
export default Message;