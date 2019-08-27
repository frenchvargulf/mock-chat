import React, { Component } from 'react'
import GetUsername from './components/GetUsername';
import Chat from './components/Chat'

class App extends Component {
  state = {
    currentUsername: '',
    visibleScreen: "getUsernameScreen"
  }
  
  // Authenticate users
  onUsernameSubmitted(username) {
    fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })
    .then(response => {
      this.setState({
        currentUsername: username,
        visibleScreen: 'Chat'
      })
    })
    .catch(error => console.error('error', error))
  }

  render() {
    const {visibleScreen, currentUsername} = this.state;

      if (visibleScreen === 'getUsernameScreen') {
        return <GetUsername onSubmit={(e) => this.onUsernameSubmitted(e)} />
      }

      if (visibleScreen === 'Chat') {
        return <Chat currentUsername={currentUsername} />
      }
      
  }
}

export default App
