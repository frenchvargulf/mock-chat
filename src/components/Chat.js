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
  sendFile,
  // updateLanguage,
  // translateText
  handleSlashCommand,
  sendNews
} from "../methods";
import ImageUploadDialog from "./ImageUploadDialog";
import { format } from 'date-fns';
import UpperContainer from './UpperContainer'
import './ImageUploadDialog.scss'
import EmojiPicker from 'emoji-picker-react';
import JSEMOJI from 'emoji-js';
import 'emoji-picker-react/dist/universal/style.scss'; 
import Picker from 'react-giphy-component';
import { css } from 'glamor';
import ScrollToBottom from 'react-scroll-to-bottom';

// Global code for Emojis
let jsemoji = new JSEMOJI();
jsemoji.img_set = 'emojione';
jsemoji.img_sets.emojione.path = 'https://cdn.jsdelivr.net/emojione/assets/3.0/png/32/';
console.log(jsemoji.img_sets.emojione.path)
jsemoji.supports_css = false;
jsemoji.allow_native = false;
jsemoji.init_env();
jsemoji.replace_mode = 'unified';


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
      openGiphyPicker: false,
      emoji: [],
      gifs: [],
      language: 'auto',
    }      
    this.getRooms = this.getRooms.bind(this);
    this.onDrop = onDrop.bind(this);
    this.openImageUploadDialog = openImageUploadDialog.bind(this);
    this.closeImageUploadDialog = closeImageUploadDialog.bind(this);
    this.sendFile = sendFile.bind(this);
    // this.updateLanguage = updateLanguage.bind(this);
  }   
  

  // RESOLVING PROMISES?????
  componentWillUnmount(){
    return Promise.resolve();
  }
  
  sendMessage(currentUser) {
    const parts = [];

    // Check if input has / 
    if (this.state.newMessage.startsWith("/")) {
      handleSlashCommand.call(this, this.state.newMessage);
    }
    
    // Push text to parts
    parts.push({
      type: "text/plain",
      text: `${this.state.newMessage}`,
      content: `${this.state.newMessage}`
    });

    // Push emoji67
    if (this.state.emoji) {
      this.state.emoji.forEach(emoji => {
        parts.push({
          url: emoji,
          type: "gif",
          className: "img-emoji"
        });
        console.log(parts)
      });
    }

    if (this.state.gifs) {
      this.state.gifs.forEach(gif => {
        parts.push({
          url: gif,
          type: "image/gif",
          className: "gif"
        });
        console.log(parts)
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
      emoji: [],
      parts: [],
      gifs: [],
      newMessage: "",
    })   
       
  }       

  handleInput(event){
    this.setState({
      fileUploadMessage: event.target.value,
    })
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

  onSubmit(e){
    e.preventDefault();
    this.sendMessage(this.state.currentUser);
  }   

  sendTypingEvent(event) {
    this.state.currentUser
      .isTypingIn({ roomId: this.state.roomId, })
      .catch(error => console.error('error', error))
      this.setState({
        chatInput: event.target.value,
        newMessage: event.target.value
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
      
    this.setState({
      messages: [],
    })

    return currentUser.subscribeToRoom({
          roomId: roomId,
          messageLimit: 100,
          hooks: {
            onMessage: message => {
          
              // console.log(message.text)    
              
                let newMessages = this.state.messages;   
                // {translateText.call(this, message)}
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
                  }
                  linktext={message.text.match(/\b(http|https)?:\/\/\S+/gi) || null}/>)         
                  {this.setState({messages: newMessages})}
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

  showGiphyPicker() {
    this.setState({
      openGiphyPicker: !this.state.openGiphyPicker,
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
    const { newMessage } = this.state;
    let emoji = jsemoji.replace_colons(`:${object.name}:`);
    const text = `${newMessage}:${object.name}:`;
    let path = `${jsemoji.img_sets.emojione.path}${object.unified}.png`

    this.setState({
      openEmojiPicker: false,
      chatInput: `${this.state.chatInput}${text}`,
      newMessage: `${this.state.chatInput}`,
      emoji: [...this.state.emoji, path]
    });
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
  
  log (gif) {
    this.setState({
      chatInput: [gif.downsized.url],
      gifs: [gif.downsized.url],
      openGiphyPicker: !this.state.openGiphyPicker,
    })
  }

  render() {
    const {currentUser, currentRoom, joinableRooms, joinedRooms, roomId, paint, typingUsers, messages, chatInput, showImageUploadDialog,
    fileUploadMessage, openEmojiPicker, newMessage, openGiphyPicker, language} = this.state
    
    const ROOT_CSS = css({
      height: '100%',
      width: '100%'
    });

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
             {/* {currentRoom ? (
                <select
                  id="language"
                  className="language"
                  name="language"
                  value={language}
                  onChange={(e) => this.updateLanguage(e)}
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="de">German</option>
                </select>
              ) : null} */}
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
                <ScrollToBottom className={ ROOT_CSS }>
                  {messages} 
                  </ScrollToBottom>
                </ul>

                {/* {messageList}
           */}
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
                    <Smile style={{backgroundColor: "#fff"}}/>  
                  </button> 
                  <button type="button" className="giphy-button" onClick={(e)=>this.showGiphyPicker(e)}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="icons" className="svg-inline--fa fa-icons fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M116.65 219.35a15.68 15.68 0 0 0 22.65 0l96.75-99.83c28.15-29 26.5-77.1-4.91-103.88C203.75-7.7 163-3.5 137.86 22.44L128 32.58l-9.85-10.14C93.05-3.5 52.25-7.7 24.86 15.64c-31.41 26.78-33 74.85-5 103.88zm143.92 100.49h-48l-7.08-14.24a27.39 27.39 0 0 0-25.66-17.78h-71.71a27.39 27.39 0 0 0-25.66 17.78l-7 14.24h-48A27.45 27.45 0 0 0 0 347.3v137.25A27.44 27.44 0 0 0 27.43 512h233.14A27.45 27.45 0 0 0 288 484.55V347.3a27.45 27.45 0 0 0-27.43-27.46zM144 468a52 52 0 1 1 52-52 52 52 0 0 1-52 52zm355.4-115.9h-60.58l22.36-50.75c2.1-6.65-3.93-13.21-12.18-13.21h-75.59c-6.3 0-11.66 3.9-12.5 9.1l-16.8 106.93c-1 6.3 4.88 11.89 12.5 11.89h62.31l-24.2 83c-1.89 6.65 4.2 12.9 12.23 12.9a13.26 13.26 0 0 0 10.92-5.25l92.4-138.91c4.88-6.91-1.16-15.7-10.87-15.7zM478.08.33L329.51 23.17C314.87 25.42 304 38.92 304 54.83V161.6a83.25 83.25 0 0 0-16-1.7c-35.35 0-64 21.48-64 48s28.65 48 64 48c35.2 0 63.73-21.32 64-47.66V99.66l112-17.22v47.18a83.25 83.25 0 0 0-16-1.7c-35.35 0-64 21.48-64 48s28.65 48 64 48c35.2 0 63.73-21.32 64-47.66V32c0-19.48-16-34.42-33.92-31.67z"></path></svg>
                  </button>
              </div>  
            </form>

              <TypingIndicator typingUsers={typingUsers} /> 

              {openGiphyPicker? (
              <div className="giphy-dialog">
                  <Picker onSelected={this.log.bind(this)} />
                </div>) : null
              }
               
              {openEmojiPicker? (
                (<div className="dialog-emoji-container">
                   <div className="dialog-emoji">
                      <EmojiPicker onEmojiClick={(e, object, event) => this.addEmoji(e, object, event)} />
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
                  
              
              </div>
          </div>
        </div>
      </div>
      ); 
  }

}

export default Chat