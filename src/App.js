import React, { Component } from 'react'
import GetUsername from './components/GetUsername';
import Chat from './components/Chat'

class App extends Component {
  state = {
    currentUsername: 'User',
    visibleScreen: "Chat"
  }
  
  // Authenticate users
  // onUsernameSubmitted(username) {
  //   fetch('http:localhost:4000/users', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ username }),
  //   })
  //   .then(response => {
  //     this.setState({
  //       currentUsername: username,
  //       visibleScreen: 'Chat'
  //     })
  //   })
  //   .catch(error => console.error('error', error))
  // }

  
// if (localStorage.getItem("savedName") === null) {
//   // Default: Submit event on first-entry - validate form, save name to localStorage
//   form.addEventListener('submit', function(e){
//     e.preventDefault()
//     const userName = `${input.value}`;  
//     if (  userName.match("^[0-9]*$") || userName == "" ) {  
//       errorMessage.innerText = "Twoje imię jest za krótkie lub jest liczbą";
      
//       return;
//     }

//     localStorage.setItem('savedName', userName);
//     user.innerText = localStorage.savedName;
//     form.parentElement.parentElement.removeChild(form.parentElement);
//     dashboard.classList.remove('visible');
//   });

// } else {
//   console.log(localStorage.getItem("savedName"));
//   welcome.classList.add("visible");
//   dashboard.classList.remove("visible");
//   user.innerText = localStorage.savedName;
// }

  render() {
    const {visibleScreen, currentUsername} = this.state;

      if (visibleScreen === 'getUsernameScreen') {
        return <GetUsername onSubmit={(e) => this.onUsernameSubmitted(e)} />
      }

      if (visibleScreen === 'Chat' && currentUsername === 'User') {
        return <Chat currentUsername={currentUsername} />
      }
      
  }
}

export default App
