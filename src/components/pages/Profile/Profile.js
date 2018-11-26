import React from 'react'
import { connect } from 'react-redux'

class Profile extends React.Component {
    showProfileIfNotBanned = props => 
        props.banned === false
            ? <div className='wrapper-profile flex-column'>
                <div>
                    <h2>User section</h2>
                    <div className="profile-section-user"></div>
                </div>
                {   props.privilege === "administrator"
                        ? <div>
                            <h2>Administrator section</h2>
                            <div className="profile-section-admin"></div>
                        </div>
                        : null
                }
            </div>
            : null

    render() {
        const { props } = this;
        return (
            <div className='flex-column'>
                <div className='wrapper-description'>
                    <div className='page-description'>
                        <h1>{ `${props.username} (${props.privilege})` }
                        { props.banned ? ' - BANNED' : null }
                        </h1>
                    </div>
                </div>
                { this.showProfileIfNotBanned(props) }
            </div>
        )
    }
}

const mapStateToProps = state => ({ 
    username: state.username,
    privilege: state.privilege,
    banned: state.banned
})

export default connect(
    mapStateToProps
)( Profile )