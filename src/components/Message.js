// src/components/Message.js

import React, { Component } from 'react'
class Message extends Component{
    render () {
        console.log(this)
        return ( 
            <li key={this.props.id}>
                <div className="senderUsername"> 
                    { this.props.senderId }
                </div>
                <div className="message">
                    { this.props.text } 
                </div>
            </li>
        );
    }
};
export default Message;