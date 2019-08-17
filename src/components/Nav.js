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
      <>
        {/* <MenuButton handleMouseDown={e => this.handleMouseDown(e)}/> */}
        <div className="menu">
          <Menu 
          // handleMouseDown={e => this.handleMouseDown}
            menuVisibility={this.state.visible} 
            currentUser={this.props.currentUser}
            currentRoom={this.props.currentRoom}
            users={this.props.currentRoom.users}
            subscribeToRoom={this.props.subscribeToRoom}
            rooms={this.props.rooms}
            createRoom={this.props.createRoom}/>
            </div>
      </>
    );
  }
}
 
export default MenuContainer;