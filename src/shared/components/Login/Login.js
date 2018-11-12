import React from 'react'
import { connect } from 'react-redux'
import { showLoginModal, logOutUser } from '../../store/modules/Login'
import { changeTab } from '../../store/modules/Tabs'

class Login extends React.Component{
    showLogin = () => this.props.dispatch(showLoginModal())
    showProfile = () => this.props.state.logged ? this.props.dispatch(changeTab('profile')) : alert('You are not logged in!')
    logOut = () => this.props.dispatch(logOutUser())

    render() {
        return (
            <div>
                { !this.props.state.logged
                    ? (
                        <div className='button flex-row' onClick={ this.showLogin }>
                            <p>Log in</p>
                            <i className="fas fa-sign-in-alt"></i>
                        </div>
                        )
                    : (
                        <div className="flex-row">
                            <div className='button flex-row' style={{ borderLeft: "none" }} onClick={ this.showProfile }>
                                <p>{ this.props.state.username }</p>
                            </div>
                            <div className='button flex-row' onClick={ this.logOut }>
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