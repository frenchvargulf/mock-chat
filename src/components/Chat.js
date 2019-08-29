import React, { Component } from 'react'
import '../App.css';
import Chatkit from '@pusher/chatkit-client';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import MenuContainer from './Nav';
import Canvas from "./components";
import { Image } from "react-feather";
import {
  // [..]
  onDrop,
  openImageUploadDialog,
  closeImageUploadDialog,
  sendFile
} from "../methods";
import ImageUploadDialog from "./ImageUploadDialog";
import { format } from 'date-fns';
import './ImageUploadDialog.css'

class Chat extends Component {  
  constructor(props){
    super(props);
    this.state = {
      messages: [],
      currentRoom: {},
      roomId: "11abd904-2e78-4393-9b1d-5eaa276adeb2",
      currentUser: {},
      typingUsers: [],
      chatInput: "",
      joinableRooms: [],
      joinedRooms: [],
      newMessage: [],
      paint: false,
      rooms: [],
      pictures: [],
      showImageUploadDialog: false,
      fileUploadMessage: ""
    }  
    // this.state.currentUser.sendMessage = this.sendMessage.bind(this);      
    this.getRooms = this.getRooms.bind(this);
    this.onDrop = onDrop.bind(this);
    this.openImageUploadDialog = openImageUploadDialog.bind(this);
    this.closeImageUploadDialog = closeImageUploadDialog.bind(this);
    this.sendFile = sendFile.bind(this);
  }      
  
  sendMessage(currentUser) {
    const parts = [];
      parts.push({
        type: "text/plain",
        content: `${this.state.chatInput}`,
        // text: this.state.chatInput,
      });

    if(this.state.chatInput){
      currentUser.sendMultipartMessage({
        // text: this.state.chatInput,
        roomId: this.state.currentRoom.id,
        parts
      })
    }  
    this.setState({ 
        chatInput: "",
        newMessage: "",
    })          
  }       

  handleInput(event){
    this.setState({
      fileUploadMessage: event.target.value,
    })
    console.log(event.target.value)
  }


  handleClick(){
    if ( !this.state.paint ){
        this.setState({
            paint: true,
        })
    } else {
        this.setState({
            paint: false,
        })
    }

  } 

  // handleInput(event){
  //   console.log(event.target.value)
  //   this.setState({
  //     chatInput: event.target.value
  //   });
  // }

  onSubmit(e){
    e.preventDefault();
    this.sendMessage(this.state.currentUser);
  }   

  sendTypingEvent(event) {
    this.state.currentUser
      .isTypingIn({ roomId: this.state.roomId, })
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
      const {currentUser, currentRoom} = this.state;
      // console.log(`Subskyrbuję to ${roomId}`)
      
      this.setState({
          messages: [],
          
      })
      return currentUser.subscribeToRoom({
          roomId: roomId,
          messageLimit: 100,
          hooks: {
            onMessage: message => {
                            let newMessages = this.state.messages;    
                            newMessages.push(<Message 
                                                    currentUser= {
                                                      this.state.currentUser
                                                    }
                                                    media={message.attachment}
                                                    time = { format(new Date(`${message.updatedAt}`), 'HH:mm') }
                                                    key={ 
                                                        this.state.messages.length 
                                                    } 
                                                    senderId={ 
                                                        message.senderId 
                                                    }
                                                    text={ message.text 
                                                    }/>)         
                            this.setState({messages: newMessages});

                            if (currentRoom === null) return;

                            return currentUser.setReadCursor({
                              roomId: roomId,
                              position: message.id,
                            });

            },
            onRoomUpdated: room => {
              const { rooms } = this.state;
              const index = rooms.findIndex(r => r.id === room.id);
              rooms[index] = room;
              this.setState({
                rooms,
              });
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
      .then(currentRoom => {
        this.setState({ currentRoom })
      })
      .then( this.getRooms())
      .catch(error => console.error('error', error))
  }

  sendDM(ids){
    const rooms = [this.state.currentUser.rooms]
    const roomName = `${this.state.currentUser.id}_${ids.id}`;

    const isPrivateChatCreated = this.state.currentUser.rooms.filter( (room) => {
      if (room.customData && room.customData.isDirectMessage) {
        
            const arr = [this.state.currentUser.id, ids.id];
            const { userIds } = room.customData;
      
            if (arr.sort().join('') === userIds.sort().join('')) {
              return {
                room,
              };
            }
          }
        
    });
    
    if (isPrivateChatCreated.length > 0) {
        const room = isPrivateChatCreated[0];
        this.getRooms()
        return Promise.resolve(room);
    } else {
      this.state.currentUser.createRoom({
          name: roomName,
          private: true,
          addUserIds: [ids.id],
          userIds: [this.state.currentUser.id, ids.id],
          users: [this.state.currentUser.id, ids.id],
          customData: {
            isDirectMessage: true,
            userIds: [this.state.currentUser.id, ids.id],
          },
      })
      .then(room => this.subscribeToRoom(room.id))
      .then(room => ids.subscribeToRoom(room.id))
      .then(this.getRooms())
      .catch(err => console.log('error with createRoom: ', err))
    }
  }

  componentWillUnmount(){
    return Promise.resolve();
  }

  createRoom(name) {
    this.state.currentUser.createRoom({
        name,
        addUserIds: [ ...(this.state.currentUser.users.map( (user) =>{
          return user.id;
        }) ) ],
        customData: {
          isDirectMessage: false,
        },
    })
    .then(room => this.subscribeToRoom(room.id))
    .then(this.getRooms())
    .catch(err => console.lo2g('error with createRoom: ', err))
  }

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: 'v1:us1:301e1216-59fa-432c-bc17-165703f44329',
      userId: this.props.currentUsername,
      tokenProvider: new Chatkit.TokenProvider({
      url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/301e1216-59fa-432c-bc17-165703f44329/token',
      }),
    })
    chatManager
      .connect()
      .then(currentUser => {
        this.setState({ currentUser})
        this.getRooms()
        this.subscribeToRoom( this.state.roomId )
      })      
      .catch(error => console.error('error', error))
  }   

  render() {
    const {currentUser, currentRoom, joinableRooms, joinedRooms, roomId, paint, typingUsers, messages, chatInput, showImageUploadDialog,
    fileUploadMessage} = this.state

    return ( 
      <div className="container">
        <div className="sidebar-container">
            <MenuContainer currentUser={currentUser}
                            users={currentRoom.users}
                            subscribeToRoom={ (e) => this.subscribeToRoom(e)}
                            currentRoom={currentRoom}
                            rooms={[...joinableRooms, ...joinedRooms]}
                            roomId={roomId}
                            createRoom={ (e) => this.createRoom(e)}
                            handleClick={  (e) => this.handleClick(e)}
                            sendDM={ (e) => this.sendDM(e)}
                            handleMouseDown={ (e) => this.handleMouseDown(e) } 
            />
        </div>
        <div className="messanger-container">
          <div className="wrapper">
           {(paint === true)? 
            (
              <Canvas currentUser={currentUser} />
            ) : (
            <>
                <ul className="messages">
                  {messages} 
                  {/* <ChatSession messages={messages}/> */}
                </ul>
                <TypingIndicator typingUsers={typingUsers} /> 
                <form id="chat-form"
                  className="composer-container"
                  value={ chatInput } 
                  onSubmit={ (e) => this.onSubmit(e)}
                >  
                <button
                    onClick={this.openImageUploadDialog}
                    type="button"
                    className="btn image-picker"
                  ><Image/> </button>             
                <input 
                       type="text"
                       className="composer"
                       placeholder='Type message...'
                       name=""
                       value={ chatInput } 
                       autoFocus={true} 
                       onChange={ e => this.sendTypingEvent(e) } 
                       />                 
               </form>
               {showImageUploadDialog ? (
              <ImageUploadDialog
                handleInput={ e => this.handleInput(e)}
                // sendMessage={this.sendMessage}
                // value={ chatInput } 
                // onSubmit={ (e) => this.onSubmit(e)}
                fileUploadMessage={fileUploadMessage}
                onDrop={this.onDrop}
                sendFile={this.sendFile}
                closeImageUploadDialog={this.closeImageUploadDialog}
              />
            ) : null}               
            </>  )}
          </div>
        </div>
      </div>
      ); 
  }

}

export default Chat