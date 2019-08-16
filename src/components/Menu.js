import React, { Component } from "react";
import "./Menu.css";
import WhosOnlineList from './WhosOnlineList';
import RoomList from './RoomList';
import NewRoomForm from './NewRoom';
 
class Menu extends Component {
  render() {
    var visibility = "hide";
 
    if (this.props.menuVisibility) {
      visibility = "show";
    }

    return (
      <div id="flyoutMenu" 
        onMouseDown={this.props.handleMouseDown} 
        className={visibility} >
            <WhosOnlineList
                currentUser={this.props.currentUser}
                    users={this.props.currentRoom.users}
                    className="whosOnlineListContainer"
            />
            <RoomList
                        subscribeToRoom={this.subscribeToRoom}
                            rooms={this.props.rooms}
                        roomId={this.props.roomId} />
            <NewRoomForm createRoom={this.createRoom} />
      </div>
    );
  }
}
 
export default Menu;