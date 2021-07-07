// import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
// import Swipe from 'react-easy-swipe';
// import MenuContainer from './Nav';
 
// class MenuSwiper extends Component {
//     constructor(props){
//         super(props)
//     }

// gdzie zostało dotknięte , czy
// dodawać klasę
// przesunięcie sekundę powyżej 200px to schowaj

   
//   onSwipeStart(event) {
      
//     console.log('Start swiping...', event);
//   }
 
//   onSwipeMove(position, event) {
//     console.log(`Moved ${position.x} pixels horizontally`, event);
//     console.log(`Moved ${position.y} pixels vertically`, event);
//   }
 
//   onSwipeEnd(event) {
//     console.log('End swiping...', event);
//   }
 
//   render() {
//       console.log(this.props)
 
//     return (
//       <Swipe
//         onSwipeStart={this.onSwipeStart}
//         onSwipeMove={this.onSwipeMove}
//         onSwipeEnd={this.onSwipeEnd}>
//           <MenuContainer
//           currentUser={this.props.currentUser}
//           users={this.currentRoom.users}
//           subscribeToRoom={this.subscribeToRoom}
//           currentRoom={this.state.currentRoom}
//           rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}
//           roomId={this.state.roomId}
//           createRoom={this.createRoom}
          
//           />
//       </Swipe>
//     );
//   }
// }
 
// ReactDOM.render(<MenuSwiper/>, document.getElementById('root'));
 
// export default MenuSwiper;