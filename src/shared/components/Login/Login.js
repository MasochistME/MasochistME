import React from 'react'
import { connect } from 'react-redux'
import { showLoginModal } from '../../store/modules/Login'

class Login extends React.Component{
    showLogin = () => this.props.dispatch(showLoginModal())

    render() {
        return (
            <div className='button flex-row' onClick={ () => this.showLogin() }>
                <p>Not logged in</p>
                <i className="fas fa-sign-in-alt"></i>
            </div>
        )
    }
}

const mapStateToProps = state => ({ state })
export default connect(
    mapStateToProps
)( Login )