import React, { Component } from 'react'
import "./GetUsername.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

    class GetUsername extends Component {
     constructor(props) {
       super(props)
       this.state = {
         username: '',
       }
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
                <h2 className="login-header">Login</h2>
                <h3 className="login-instructions">Username</h3>
                <form onSubmit={ (e) => this.onSubmit(e) }>
                    <input
                    type="text"
                    placeholder="Please type in User"
                    onChange={ (e) => this.onChange(e)}
                    />
                </form>
            </div>
        </div>
        )
    }
}
export default GetUsername;