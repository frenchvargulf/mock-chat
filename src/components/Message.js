import React, { Component } from 'react'
import './Message.css'

class Message extends Component{
    render () {
        return ( 
            <div>
                <li key={this.props.id} className="Message">
                    <p > 
                        { this.props.senderId }
                    </p>
                    <p >
                        { this.props.text } 
                    </p>
                </li>
            </div>
        );
    }
};
export default Message;