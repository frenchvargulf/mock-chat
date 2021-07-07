import React, {
  Component
} from 'react'
import GetUsername from './components/GetUsername';
import Chat from './components/Chat'

class App extends Component {
  state = {
    currentUsername: 'User',
    visibleScreen: "Chat"
  }

  // Authenticate users
  onUsernameSubmitted(username, password) {
    fetch('http:localhost:4000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        }),
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
    const {
      visibleScreen,
      currentUsername
    } = this.state;

    if (visibleScreen === 'getUsernameScreen') {
      return <GetUsername onSubmit = {
        (e) => this.onUsernameSubmitted(e)
      }
      />
    }

    if (visibleScreen === 'Chat') {

      return <Chat currentUsername = {
        currentUsername
      }
      />
    }

  }
}

export default App