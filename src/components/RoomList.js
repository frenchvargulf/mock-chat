import React from 'react';
import './WhosOnlineList.scss'

class RoomLink extends React.Component {
    render(){
        const isRoomActive = this.props.room.id === this.props.currentRoom.id ? 'active' : '';
        return (
            <li className={isRoomActive} key={this.props.room.id}  >
                 <a key={this.props.room.id}
                     onClick={(e) => {
                         this.props.subscribeToRoom(this.props.room.id)
                     } }
                     >
                     <span className="room-name"> # {this.props.room.name} </span>
                     {this.props.room.unreadCount > 0 ? (
                        <span className="room-unread">{this.props.room.unreadCount}</span>
                    ): null}
                      
                 </a>
            </li>
        )
    }
}

class RoomList extends React.Component {
    render () {
        const orderedRooms = [...this.props.rooms].sort((a, b) => a.id > b.id)
        return (
            <div className="rooms-list">
                <h3 className="room-title">Channels</h3>
                <ul>
                        {orderedRooms.map(room => {
                            if (!room.isPrivate){
                                return ( <RoomLink key={room.id} currentRoom={this.props.currentRoom} room={room} subscribeToRoom={this.props.subscribeToRoom} />)
                            } else {
                                return (
                                    null
                                )
                            }
                        })}
                </ul>
                <h3 className="room-title">Direct Messages</h3>
                <ul>
                        {orderedRooms.map(room => {
                            if (room.isPrivate){
                                return ( <RoomLink key={room.id} currentRoom={this.props.currentRoom} room={room} subscribeToRoom={this.props.subscribeToRoom} />)
                            } else {
                                return (
                                    null
                                )
                            }
                        })}
                </ul>


            </div>
        )
    }
}

export default RoomList