import React, { Component } from 'react'
import './Message.css'

class Message extends Component{
    render () {
        console.log(this.props)
        // let time = new Date(this.props.timestamp);

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
                {/* <span className="timestamp">
                    {time.getHours() + ':' + time.getMinutes() + ":" + time.getSeconds() }
                </span> */}
            </div>
            
        );
    }
};
export default Message;