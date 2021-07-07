import React from 'react';
import './WhosOnlineList.css'


class RoomLink extends React.Component {
    render () {
        return (
            
            <li key={room.id} className={"room " + active}>
                                 
                <a 
                    onClick={() => this.props.subscribeToRoom(room.id)}
                    href={room.name}>
                    # {room.name}
                </a>

            </li>
                
      
        )
    }
}

export default RoomLink