import React from 'react'
import { connect } from 'react-redux'
import { showLoginModal } from '../../store/modules/Login'
import { sha256 } from '../../helpers/hash'
import logins from '../../mock/credentials.json'

const loginModalVisible = show => show ? "login-modal-wrapper display-flex" : "login-modal-wrapper display-none"

class LoginModalForm extends React.Component {
    constructor() {
        super()
        this.state = {
            username: null,
            password: null
        }
    }

    logIn = () => {
        console.log(this.state)
        logins.hasOwnProperty(this.state.username)
            ? logins[this.state.username] === this.state.password
                ? alert('User logged in!')
                : alert('Incorrect password.')
            : alert('Such user does not exist.')
    }

    handleUsernameChange = event => this.setState({ username: event.target.value })
    handlePasswordChange = event => this.setState({ password: sha256(event.target.value) })

    render() {
        return (
            <div className="login-modal-form">
                <input 
                    className="login-modal-input" 
                    placeholder="Username"
                    onChange={ this.handleUsernameChange }
                    ></input>
                <input 
                    className="login-modal-input" 
                    placeholder="Password" 
                    type="password"
                    onChange={ this.handlePasswordChange }
                    ></input>
                <button className="custom-button login-modal-button" onClick={ () => this.logIn() }>Log in</button>
                <a href="#">Register</a>
            </div>
        )
    }
}


class LoginModal extends React.Component {
    showLogin = () => this.props.dispatch(showLoginModal())

    render() {
        const { props } = this;
        return (
            <div className={ loginModalVisible(props.state.showLoginModal) }>
                <div className="login-modal">
                    <LoginModalForm />
                    <button className="custom-button" onClick={ () => this.showLogin() }>Close</button>
                </div>
            </div>
        )
    }    
}

const mapStateToProps = state => ({ state })
const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(
    mapStateToProps,
    mapDispatchToProps
)( LoginModal )