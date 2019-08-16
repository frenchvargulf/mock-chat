import React from 'react';
import './WhosOnlineList.css'

class RoomList extends React.Component {
    render () {
        const orderedRooms = [...this.props.rooms].sort((a, b) => a.id > b.id)
        return (
            <div className="rooms-list">
                <h3 className="room-title">Your rooms</h3>
                <ul>
                        {orderedRooms.map(room => {
                            const active = room.id === this.props.roomId ? 'active' : '';
                            return (
                                <li key={room.id} className={"room " + active}>
                                    <a
                                        onClick={() => this.props.subscribeToRoom(room.id)}
                                        href="#">
                                        # {room.name}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
            </div>
        )
    }
}

export default RoomList