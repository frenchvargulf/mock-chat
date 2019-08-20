import React, { Component } from "react";
import './MenuButton.css';

import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
 
class MenuButton extends Component {
  render() {
    return (
      <button id="roundButton"
        onMouseDown={this.props.handleMouseDown}>
      </button>
    );
  }
}
 
export default MenuButton;