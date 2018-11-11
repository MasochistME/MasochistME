import React from 'react'
import { connect } from 'react-redux'
import { showLoginModal, logOutUser } from '../../store/modules/Login'

class Login extends React.Component{
    showLogin = () => this.props.dispatch(showLoginModal())

    render() {
        return (
            <div>
                { !this.props.state.logged
                    ? (
                        <div className='button flex-row' onClick={ () => this.showLogin() }>
                            <p>Log in</p>
                            <i className="fas fa-sign-in-alt"></i>
                        </div>
                        )
                    : (
                        <div className="flex-row">
                            <div className='button flex-row' style={{ borderLeft: "none" }} onClick={ () => alert('Profile will be here soon!') }>
                                <p>{ this.props.state.username }</p>
                            </div>
                            <div className='button flex-row' onClick={ () => this.props.dispatch(logOutUser()) }>
                                <p>Log out</p>
                                <i class="fas fa-sign-out-alt"></i>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({ state })
const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(
    mapStateToProps,
    mapDispatchToProps
)( Login )