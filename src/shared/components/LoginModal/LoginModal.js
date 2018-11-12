import React from 'react'
import { connect } from 'react-redux'
import { showLoginModal, logInUser } from '../../store/modules/Login'
import { sha256 } from '../../helpers/hash'
import logins from '../../mock/credentials.json'

const loginModalVisible = show => show ? "login-modal-wrapper display-flex" : "login-modal-wrapper display-none"

class LoginModal extends React.Component {
    constructor() {
        super()
        this.state = {
            username: null,
            password: null,
            repeatedPassword: null,
            registration: false
        }
    }

    handleUsernameChange = event => this.setState({ username: event.target.value })
    handlePasswordChange = event => this.setState({ password: sha256(event.target.value) })
    handleRepeatedPasswordChange = event => this.setState({ repeatedPassword: sha256(event.target.value) })

    showLogin = () => this.props.dispatch(showLoginModal())
    showRegistration = () => this.setState({ registration: !this.state.registration })

    logInOrRegister = () => {
        this.state.registration
            ? this.register()
            : this.logIn()
    }
    logIn = () => {
        if (logins.hasOwnProperty(this.state.username) && logins[this.state.username] === this.state.password) {
            this.showLogin()
            return this.props.dispatch(logInUser(this.state.username))
        }
        alert(`Incorrect password or username.`)
    }
    register = () => {
        if (this.state.password !== this.state.repeatedPassword)
            return alert("Passwords differ.")
        logins[this.state.username] = this.state.password
        alert("User created! Now you can log in.")
    }

    render() {
        const { props } = this;
        return (
            <div className={ loginModalVisible(props.state.showLoginModal) }>
                <div className="login-modal">
                    <div className="login-modal-form">
                        <input 
                            className="login-modal-input" 
                            placeholder="Username"
                            onChange={ this.handleUsernameChange }
                            ></input>
                        <input 
                            className="login-modal-input" 
                            placeholder="Email"
                            hidden="true"
                            ></input>
                        <input 
                            className="login-modal-input" 
                            placeholder="Password" 
                            type="password"
                            onChange={ this.handlePasswordChange }
                            ></input>
                        <input 
                            className="login-modal-input" 
                            placeholder="Repeat password" 
                            type="password"
                            onChange={ this.handleRepeatedPasswordChange }
                            hidden={ !this.state.registration }
                            ></input>
                        <button className="custom-button login-modal-button" onClick={ () => this.logInOrRegister() }>
                            {
                                !this.state.registration
                                    ? "Log in"
                                    : "Register"
                            }
                        </button>
                        <div onClick={ () => this.showRegistration() }>
                            {
                                this.state.registration
                                    ? "Log in"
                                    : "Register"
                            }
                        </div>
                    </div>
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