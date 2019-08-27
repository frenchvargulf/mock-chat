import React, { Component } from 'react'
import './Message.css'

const Img = ({src}) => {
    return (<img src={src} alt={src}></img>)
}

class Message extends Component{
    render () {
        return (
            <li key={this.props.id} className="message-cnt" >
                <div className="avatar-container">
                    <img style={{width:"50px", height:"50px", backgroundImage:"grey"}}></img>
                </div>
                <div className="info-container">
                    <div className="sender">
                    <span className="message-time">{this.props.time}</span> 
                        <div className="message-sender"> 
                            { this.props.senderId }
                        </div>
                    </div>
                    <div className="Message" >
                        { this.props.text } 
                        { this.props.media != null? <Img src={this.props.media.link}/>:null}
                    </div>
                </div>
            </li>
        );
    }
};
export default Message;