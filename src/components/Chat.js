import React, { Component } from 'react'
import '../App.css';
import Chatkit from '@pusher/chatkit-client';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import MenuContainer from './Nav';

class Chat extends Component {  
  constructor(props){
    super(props);
    this.state = {
      messages: [],
      currentRoom: {},
      currentUser: {},
      typingUsers: [],
      chatInput: "",
      joinableRooms: [],
      joinedRooms: [],
    }        
    // this.setChatInput = this.setChatInput.bind(this);
    this.state.currentUser.sendMessage = this.sendMessage.bind(this);
    // this._handleKeyPress = this._handleKeyPress.bind(this);
    // this._onClick = this._onClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.sendTypingEvent = this.sendTypingEvent.bind(this);

    this.subscribeToRoom = this.subscribeToRoom.bind(this)
    this.getRooms = this.getRooms.bind(this)
    this.createRoom = this.createRoom.bind(this)
  }      
  // update the input field when the user types something
  // setChatInput(event){
  //   this.setState({
  //     chatInput: event.target.value,
  //     timestamp: event.target.timestamp,
  //   }); 
  // }   
  
  sendMessage(currentUser) {
    if(this.state.chatInput){
      currentUser.sendMessage({
        text: this.state.chatInput,
        roomId: "3acefd1b-2452-495f-bb56-91880b939c84",
      })
    }  
    this.setState({ chatInput: ""})          
  }       
  // _handleKeyPress(e){
  //         if (e.key === 'Enter') {
  //             console.log(this)
  //             this.state.currentUser.sendMessage();
  //         }
  //     }    
  
  // _onClick(e){
  //   this.sendMessage(this.state.currentUser)
    
  // }  

  onSubmit(e){
    e.preventDefault();
    this.sendMessage(this.state.currentUser);
  }   

  sendTypingEvent(event) {
    console.log("Event typing")
    this.state.currentUser
      .isTypingIn({ roomId: "3acefd1b-2452-495f-bb56-91880b939c84", })
      .catch(error => console.error('error', error))
      this.setState({
        chatInput: event.target.value
    });
  }

  getRooms() {
    this.state.currentUser.getJoinableRooms()
    .then(joinableRooms => {
        this.setState({
            joinableRooms,
            joinedRooms: this.state.currentUser.rooms
        })
    })
    .catch(err => console.log('error on joinableRooms: ', err))
  }

  subscribeToRoom(roomId) {
    this.setState({ messages: [] })
    this.state.currentUser.subscribeToRoom({
        roomId: roomId,
        hooks: {
            onNewMessage: message => {
                this.setState({
                    messages: [...this.state.messages, message]
                })
            }
        }
    })
    .then(room => {
        this.setState({
            roomId: room.id
        })
        this.getRooms()
    })
    .catch(err => console.log('error on subscribing to room: ', err))
  }

  createRoom(name) {
    this.state.currentUser.createRoom({
        name
    })
    .then(room => this.subscribeToRoom(room.id))
    .catch(err => console.log('error with createRoom: ', err))
  }

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: 'v1:us1:71daff79-bcec-48e1-90fc-3fb8d9816fd5',
      userId: this.props.currentUsername,
      tokenProvider: new Chatkit.TokenProvider({
      url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/71daff79-bcec-48e1-90fc-3fb8d9816fd5/token',
      }),
    })
    chatManager
      .connect()
      .then(currentUser => {
        this.setState({ currentUser })
        this.getRooms()
        return currentUser.subscribeToRoom({
          roomId: "3acefd1b-2452-495f-bb56-91880b939c84",
          messageLimit: 100,
          hooks: {
            onMessage: message => {
                            let newMessages = this.state.messages;           
                            newMessages.push(<Message 
                                                    key={ 
                                                        this.state.messages.length 
                                                    } 
                                                    senderId={ 
                                                        message.senderId 
                                                    }
                                                    
                                                    text={ message.text 
                                                    }/>)         
                            this.setState({messages: newMessages})
            },
            onUserStartedTyping: user => {
              this.setState({
                typingUsers: [...this.state.typingUsers, user.name],
              })
            },
            onUserStoppedTyping: user => {
              this.setState({
                typingUsers: this.state.typingUsers.filter(
                  username => username !== user.name
                ),
              })
            },
            onPresenceChange: () => this.forceUpdate(),
          },
        })
      })      
      .then(currentRoom => {
        this.setState({ currentRoom })
      })
      .catch(error => console.error('error', error))
  }   

  render() {
    return ( 
      <div className="container">
        
          <MenuContainer currentUser={this.state.currentUser}
                        users={this.state.currentRoom.users}
                        subscribeToRoom={this.subscribeToRoom}
                        currentRoom={this.state.currentRoom}
                        rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}
                        roomId={this.state.roomId}
                        createRoom={this.createRoom}
           />
          
            <ul className="messages">
              { this.state.messages } 
              
            </ul>
            <TypingIndicator typingUsers={this.state.typingUsers} />
          
          
                <form id="chat-form"
                className="composer-container"
                    value={ this.state.chatInput } 
                  onSubmit={this.onSubmit}
                  >                    
                    <input 
                    // id="chat-input"
                        type="text"
                        className="composer"
                        placeholder='Type message...'
                        name=""
                        value={ this.state.chatInput } 
                        // onChange={ this.setChatInput }
                        autoFocus={true} 
                        onChange={ this.sendTypingEvent } 
                        
                        // onKeyPress={ this._handleKeyPress }
                        />                 
                    {/* <div id="btndiv"> */}
                    {/* <input id="button" type="button"
                        onClick={ this._onClick} value="Send Chat"
                         /> */}
                    {/* <TypingIndicator typingUsers={this.state.typingUsers} /> */}
                    {/* </div>  */}
                </form>  
                                       
    
      </div>
      ); 
    }


}

export default Chat