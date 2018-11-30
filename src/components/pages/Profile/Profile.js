import React from 'react'
import { connect } from 'react-redux'
import members from '../../../shared/mock/credentials.json'

class Profile extends React.Component {
    memberList = () => {
        let memberArray = [ ]
        for (let member in members) {
            memberArray.push({
                username: member,
                ...members[member]
            })
        }
        return memberArray.map(member => 
            <div 
                key={ `management-member-${ member.id }` }
                className="profile-management-member">
                    <div>{ member.username }</div>
                    {
                        member.username !== this.props.username 
                            ? member.banned === true
                                ? <div className="button ban-button">UNBAN</div>
                                : <div className="button ban-button">BAN</div>
                            : null
                    }
            </div>)
    }
    userSection = () => 
        <div className="profile-section">
            <h2>User section</h2>
            <div className="profile-section-user">
                <h3>Edit your profile</h3>
                <div className="flex-row">
                    <label htmlFor="profile-input-avatar">Your new avatar URL:</label>
                    <input id="profile-input-avatar" placeholder="avatar url"></input>
                </div>
                <div className="flex-row">
                    <label htmlFor="profile-input-description">Your new description:</label>
                    <input id="profile-input-description" placeholder="description"></input>
                </div>
            </div>
        </div>
    
    adminSection = () => 
        <div className="profile-section">
            <h2>Administrator section</h2>
            <div className="profile-section-admin">
                <h3>User management</h3>
                <div>
                {
                    this.memberList()
                }
                </div>
            </div>
        </div>

    showUserProfile = () => this.userSection()
    showAdminProfile = () => 
        this.props.privilege === "administrator"
            ? this.adminSection()
            : null

    showProfileIfNotBanned = props => 
        props.banned === false
            ? <div className='wrapper-profile flex-column'>
                { this.showUserProfile() }
                { this.showAdminProfile() }
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
                        <div className="flex-row">
                            <img src="https://c10.patreonusercontent.com/3/eyJ3IjoyMDB9/patreon-media/p/user/3743454/5b421206749245b286ae5699490a1caf/1?token-time=2145916800&token-hash=e2xXNaeh6aNkZ8DFBVrjbDE8V2kQWkrwOr-4T-oiVNQ%3D" alt="avatar" style={{ width: "128px", minWidth: "128px", height: "128px", minHeight: "128px", marginRight: "15px", border: "1px solid #000" }} />
                            <div>Quisque lacinia nisl tristique ultrices dignissim. Curabitur ac neque tincidunt, dictum sapien quis, feugiat felis. Morbi iaculis massa vel nunc malesuada vulputate. Quisque quis sem nisl. Vestibulum finibus lorem in ante euismod suscipit. Nam justo diam, semper ac nibh auctor, tristique varius nisi. Praesent ultrices facilisis urna, vel varius mauris eleifend in. Vivamus ut venenatis quam. Suspendisse dolor augue, maximus eget lacus elementum, euismod accumsan neque. Aliquam erat volutpat. Donec nec lorem elementum, tempus elit in, faucibus dolor. Vivamus molestie tincidunt ipsum, pretium scelerisque augue imperdiet id. Etiam tempus placerat lorem quis posuere. </div>
                        </div>
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