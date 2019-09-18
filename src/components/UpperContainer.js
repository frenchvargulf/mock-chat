import React, { Component } from "react";
// import MenuButton from './MenuButton'
import Menu from './Menu'
import './Menu.scss'
import './UpperContainer.scss'

class UpperContainer extends Component {
  constructor(props){
    super(props)
    this.state = {
      visible: false,
    };
  }

  render() {
     
    return (
      <div className="menu-container">
            <div className="info-cnt">
                <div>#{this.props.currentRoom.name}</div>
            </div>
            <div className="work-cnt">
                <div>Members: {this.props.currentRoom.userIds? this.props.currentRoom.userIds.length:null}</div>
            </div>
      </div>
    );
  }
}
 
export default UpperContainer;