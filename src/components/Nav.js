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
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }
  handleMouseDown(e) {
    this.toggleMenu();
 
    console.log("clicked");
    e.stopPropagation();
  }
   
  toggleMenu() {
    this.setState({
        visible: !this.state.visible
    });
    console.log("toggle")
  }

  render() {
    return (
      <>
        <MenuButton handleMouseDown={this.handleMouseDown}/>
          <Menu handleMouseDown={this.handleMouseDown}
            menuVisibility={this.state.visible} 
            currentUser={this.props.currentUser}
            currentRoom={this.props.currentRoom}
            users={this.props.currentRoom.users}
            subscribeToRoom={this.subscribeToRoom}
            rooms={this.props.rooms}
            createRoom={this.createRoom}/>
      </>
    );
  }
}
 
export default MenuContainer;