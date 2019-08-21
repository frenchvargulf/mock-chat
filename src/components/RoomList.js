import React from 'react';
import './WhosOnlineList.css'

class RoomLink extends React.Component {
    render(){
    
        return (
            <li key={this.props.room.id} className={"room " + this.props.room.active}>
                 <a key={this.props.room.id}
                     onClick={(e) => {
                         this.props.subscribeToRoom(this.props.room.id)
                     } }
                     >
                     # {this.props.room.name}
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
                                return ( <RoomLink key={room.id} room={room} subscribeToRoom={this.props.subscribeToRoom} />)
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
                                return ( <RoomLink key={room.id} room={room} subscribeToRoom={this.props.subscribeToRoom} />)
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