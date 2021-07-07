import React from 'react'

class NewRoomForm extends React.Component {
    
    constructor() {
        super()
        this.state = {
            roomName: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    
    handleChange(e) {
        this.setState({
            roomName: e.target.value
        })
    }
    
    handleSubmit(e) {
        e.preventDefault()
        this.props.createRoom(this.state.roomName)
        this.setState({roomName: ''})
    }
    
    render () {
        return (
            <div className="new-room-form-container">
                <h3 className="room-title">Create new room</h3>
                <form className="new-room-form" onSubmit={this.handleSubmit} >
                    <input
                        value={this.state.roomName}
                        onChange={this.handleChange}
                        
                        type="text" 
                        placeholder="Create a room" 
                        
                        className="room-input" />
                    {/* <button id="create-room-btn" type="submit"></button> */}
                </form>
            </div>
        )
    }
}

export default NewRoomForm