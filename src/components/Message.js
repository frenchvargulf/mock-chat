import React, { Component } from 'react'
import './Message.scss'
import cat from './annabelle.png';
import yoda from './yoda.png'




const Img = ({src, type}) => {
    return (<img src={src} alt={src} className={type=='file'? 'emojis':'images'}></img>)
}

class Message extends Component{
    render () {
        return (            
            <li key={this.props.id} className="message-cnt" >
                <div style={{width:"50px", height:"50px", backgroundImage: "grey"}} className="avatar-container">
                    <img src={this.props.senderId==='User'?`${yoda}`:`${cat}`}/>
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
                        {this.props.linktext?
                            (<a href={this.props.linktext}>link</a>):null
                        }
                        { this.props.media != null? <Img src={this.props.media.link} type={this.props.media.type}/>:null}
                    </div>
                </div>
            </li>
        );
    }
};
export default Message;