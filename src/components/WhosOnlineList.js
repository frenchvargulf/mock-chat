import React, { Component } from 'react'
import './WhosOnlineList.css'

class WhosOnlineList extends Component {
  renderUsers() {
    return (
      <div>
        <h3 className="online-title">Users Online</h3>
        <ul>
          {this.props.users.map((user, index) => {
            if (user.id === this.props.currentUser.id) {
              return (
                <WhosOnlineListItem key={index} presenceState="online">
                  {user.name} (You) 
                </WhosOnlineListItem>
              )
            }
            return (
              <WhosOnlineListItem key={index} presenceState={user.presence.state}>
                {user.name}
                <div 
                 className="send-dm-btn" onClick={(e) => this.props.sendDM(user)}
                >+</div>
              </WhosOnlineListItem>
            )
          })}
        </ul>
      </div>
    )
  }

  render() {
    if (this.props.users) {
      return this.renderUsers()
    } else {
      return <p>Loading...</p>
    }
  }
}

class WhosOnlineListItem extends Component {
  render() {
    const styles = {
      li: {
        display: 'flex',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 2,
        paddingBottom: 2,
      },
      div: {
        borderRadius: '50%',
        width: 11,
        height: 11,
        marginRight: 10,
      },
    }
    return (
      <li style={styles.li}>
        <div
          style={{
            ...styles.div,
            backgroundColor:
              this.props.presenceState === 'online' ? '#539eff' : '#414756',
          }}
        />
        {this.props.children}
      </li>
    )
  }
}

export default WhosOnlineList;