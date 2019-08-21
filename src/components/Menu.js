import React, { Component } from "react";
import "./Menu.css";
import WhosOnlineList from './WhosOnlineList';
import RoomList from './RoomList';
import NewRoomForm from './NewRoom';
import './WhosOnlineList.css';
import Canvas from './components';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Paint extends Component {

  
  render(){
    return (
      <div>
        <h3 className="online-title">Painting Space</h3>
        <div className="main">
          <div className="color-guide">
          <button onClick={this.props.handleClick} className="switch-button">Switch</button>
        </div>
          
        </div>
      </div>
    )
  }
}


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
            <div className="fly-container">
                <WhosOnlineList
                    currentUser={this.props.currentUser}
                        users={this.props.currentRoom.users}
                        className="whosOnlineListContainer"
                  sendDM={this.props.sendDM}
                />
                <RoomList
                            currentUser={this.props.currentUser}
                            subscribeToRoom={this.props.subscribeToRoom}
                            rooms={this.props.rooms}
                        
                            />
                <NewRoomForm createRoom={this.props.createRoom} currentUser={this.props.currentUser} />
                <Paint handleClick={this.props.handleClick} />
                </div>
            {/* <Router>
            


            <Link to="/paint/">Paint</Link>
            <Route path="/paint/" component={Paint} />
            </Router> */}
      </div>
    );
  }
}
 
export default Menu;