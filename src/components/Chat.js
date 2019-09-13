import React, { Component } from 'react'
import '../App.scss';
import Chatkit from '@pusher/chatkit-client';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import MenuContainer from './Nav';
import Canvas from "./components";
import { Image, Smile } from "react-feather";
import {
  onDrop,
  openImageUploadDialog,
  closeImageUploadDialog,
  sendFile
} from "../methods";
import ImageUploadDialog from "./ImageUploadDialog";
import { format } from 'date-fns';
import UpperContainer from './UpperContainer'
import './ImageUploadDialog.scss'
import EmojiPicker from 'emoji-picker-react';
import JSEMOJI from 'emoji-js';
import 'emoji-picker-react/dist/universal/style.scss'; // or any other way you consume scss files


    let jsemoji = new JSEMOJI();
    console.log(jsemoji)
    // set the style to emojione (default - apple)
    jsemoji.img_set = 'emojione';
    // set the storage location for all emojis
    jsemoji.img_sets.emojione.path = 'https://cdn.jsdelivr.net/emojione/assets/3.0/png/32/';
    console.log(jsemoji.img_sets.emojione.path)
    // // set the storage location for all emojis
    // jsemoji.img_sets.emojione.path = object.name;
    
    // // some more settings...
    jsemoji.supports_css = false;
    jsemoji.allow_native = false;
    jsemoji.init_env();
    jsemoji.replace_mode = 'unified';
    console.log(jsemoji)


class Chat extends Component {  
  constructor(props){
    super(props);
    this.state = {
      messages: [],
      currentRoom: {},
      roomId: "112f0357-01d9-4159-b900-a13dbda2c6cd",
      currentUser: {},
      typingUsers: [],
      chatInput: "",
      joinableRooms: [],
      joinedRooms: [],
      newMessage: "",
      paint: false,
      rooms: [],
      pictures: [],
      showImageUploadDialog: false,
      fileUploadMessage: "",
      showEmojiPicker: false,
      emoji: [],
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
      // console.log(this.state.emoji)

      
      if (this.state.emoji) {
        this.state.emoji.forEach(emoji => {
          parts.push({
            url: emoji,
            type: "image/gif",
          });
        });
    }

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
                              // this.setState({messages: newMessages}
                              // () => this.showNotification(message));
                              
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

      // .then(this.setState({
      //   currentUser,
      // }, () => this.grantNotificationPermission()
      // ))
      .then(currentRoom => {
        this.setState({ currentRoom })
      })
      .then( this.getRooms())
      .catch(error => console.error('error', error))
  }

  
  showEmojiPicker() {
    this.setState({
      openEmojiPicker: !this.state.openEmojiPicker,
    })
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

  // grantNotificationPermission = () => {
  //   if (!('Notification' in window)) {
  //     alert('This browser does not support system notifications');
  //     return;
  //   }

  //   if (Notification.permission === 'granted') {
  //     new Notification('You are already subscribed to message notifications');
  //     return;
  //   }

  //   if (
  //     Notification.permission !== 'denied' ||
  //     Notification.permission === 'default'
  //   ) {
  //     Notification.requestPermission().then(result => {
  //       if (result === 'granted') {
  //         new Notification(
  //           'Awesome! You will start receiving notifications shortly'
  //         );
  //       }
  //     });
  //   }
  // };

  // showNotification = message => {
  //   const { username } = this.state;

  //     if (message.senderId !== username) {
  //       const title = message.senderId;
  //       const body = message.text;

  //       new Notification(title, { body });
  //     }

  // // };
  addEmoji(e, object, event) {
    //  console.log(e.unified)
    console.log(object)
    //  console.log(event)
    const { newMessage } = this.state;

    //  jsemoji.replace_colons(`:${object.name}:`)
    //  console.log(jsemoji)
    let emoji = jsemoji.replace_colons(`:${object.name}:`);
    const text = `${newMessage}:${object.name}:`;
    let path = `${jsemoji.img_sets.emojione.path}${object.unified}.png`

    console.log(emoji)

     this.setState({
      //  newMessage:`${newMessage}`,
       openEmojiPicker: false,
       chatInput: `${this.state.chatInput}${text}`,
       emoji: [...this.state.emoji, path]
     });
     console.log(this.state.newMessage)
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
      instanceLocator: 'v1:us1:bca0fa4c-b9c7-4478-a63d-ad0d81584e73',
      userId: this.props.currentUsername,
      tokenProvider: new Chatkit.TokenProvider({
      url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/bca0fa4c-b9c7-4478-a63d-ad0d81584e73/token',
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
    fileUploadMessage, openEmojiPicker} = this.state

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
          <div className="upper-container"> 
          <UpperContainer currentUser={currentUser}
                        users={currentRoom.users}
                        currentRoom={currentRoom}
                        rooms={[...joinableRooms, ...joinedRooms]}
                        roomId={roomId}
            />
          </div>
          <div className="lower-container">
            <div className="main-body-wrapper">
           {(paint === true)? 
            (
              <Canvas currentUser={currentUser} />
            ) : (
            <div className="messages-list">
                <ul className="messages">
                  {messages} 
                </ul>
                {/* <TypingIndicator typingUsers={typingUsers} /> 
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
              /> */}
            {/* ) : null}                */}
            </div>  )}
          </div>
            <div className="side-container">Jestem z boku!</div>
          </div>
          <div className="bottom-cnt">
            <div className="wrap">
              
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
                
              <div style={{width: "100%", minHeight:"0", display:"flex", border:"1px solid black", borderRadius:"5px"}}>            
                <input 
                       type="text"
                       className="composer"
                       placeholder='Type message...'
                       name=""
                       value={ chatInput } 
                       autoFocus={true} 
                       onChange={ e => this.sendTypingEvent(e) } 
                       />     

                  <button
                    onClick={(e) => this.showEmojiPicker(e)}
                    type="button"
                    className="btn emoi-picker"
                  >  
                <Smile style={{backgroundColor: "#fff"}}/></button> 
              </div>  
            </form>
             
               
             {openEmojiPicker? (
               (<div className="dialog-emoji-container">
                 <div className="dialog-emoji">
                    <EmojiPicker onEmojiClick={(e, object, event) => this.addEmoji(e, object,event)} />
                 </div>
               </div>)
              ) : null}    
               
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
                 
              <TypingIndicator typingUsers={typingUsers} /> 
              </div>
          </div>
        </div>
      </div>
      ); 
  }

}

export default Chat