import React from 'react'
import { connect } from 'react-redux'
import { showLoginModal } from '../../store/modules/Login'

const loginModalVisible = show => show ? "login-modal-wrapper display-flex" : "login-modal-wrapper display-none"

const LoginModalForm = props => 
    <form className="login-modal-form">
        <input className="login-modal-input" placeholder="Username"></input>
        <input className="login-modal-input" placeholder="Password" type="password"></input>
        <button className="custom-button login-modal-button">Log in</button>
        <a href="#">Register</a>
    </form>


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