import React, { Component } from "react";
import MenuButton from './MenuButton'
import Menu from './Menu'
import './Menu.css'


 
class MenuContainer extends Component {
  constructor(props){
    super(props)
    this.state = {
      visible: false,
    };
  }
  handleMouseDown(e) {
    this.toggleMenu();
    e.stopPropagation();
  }
   
  toggleMenu() {
    this.setState({
        visible: !this.state.visible
    });
  }

  render() {
    return (
      <div className="menu-container">
        {/* <MenuButton handleMouseDown={e => this.handleMouseDown(e)}/> */}
          <Menu 
            handleMouseDown={e => this.handleMouseDown}
            menuVisibility={this.state.visible} 
            currentUser={this.props.currentUser}
            currentRoom={this.props.currentRoom}
            users={this.props.currentRoom.users}
            subscribeToRoom={this.props.subscribeToRoom}
            rooms={this.props.rooms}
            createRoom={this.props.createRoom}
            handleClick={this.props.handleClick}
            sendDM={this.props.sendDM}/>
      </div>
    );
  }
}
 
export default MenuContainer;