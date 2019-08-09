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
    this.onUsernameSubmitted = this.onUsernameSubmitted.bind(this)
  }
  onUsernameSubmitted(username) {
    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })
    .then(response => {
      console.log(response)
      this.setState({
        currentUsername: username,
        visibleScreen: 'Chat'
      })
    })
    .catch(error => console.error('error', error))
  }
  render() {
      if (this.state.visibleScreen === 'getUsernameScreen') {
        return <GetUsername onSubmit={this.onUsernameSubmitted} />
      }
      if (this.state.visibleScreen === 'Chat') {
        return <Chat currentUsername={this.state.currentUsername} />
      }
  }
}

export default App