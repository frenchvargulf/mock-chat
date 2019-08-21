import React, { Component } from 'react'
import GetUsername from './components/GetUsername';
import Chat from './components/Chat'

class App extends Component {
  constructor() {
    super()
    this.state = {
      currentUsername: '',
      visibleScreen: "getUsernameScreen"
    }
  }
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
      if (this.state.visibleScreen === 'getUsernameScreen') {
        return <GetUsername onSubmit={(e) => this.onUsernameSubmitted(e)} />
      }
      if (this.state.visibleScreen === 'Chat') {
        return <Chat currentUsername={this.state.currentUsername} />
      }
  }
}

export default App
