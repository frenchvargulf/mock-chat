import React, { Component } from 'react'
import "./GetUsername.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

    class GetUsername extends Component {
     constructor(props) {
       super(props)
       this.state = {
         username: '',
       }
       this.onSubmit = this.onSubmit.bind(this)
       this.onChange = this.onChange.bind(this)
    }
    onSubmit(e) {
        e.preventDefault()
        this.props.onSubmit(this.state.username)
    }
    onChange(e) {
        this.setState({ username: e.target.value })
    }
    render() {
        return (
        <div className="welcome-section">
            <div className="wrapper">
                <h2 className="login-header">Please insert User</h2>
                <form onSubmit={this.onSubmit}>
                    <input
                    type="text"
                    placeholder="Your full name"
                    onChange={this.onChange}
                    />
                    <button type="submit">+
                    </button>
                </form>
            </div>
        </div>
        )
    }
}
export default GetUsername;