import React from 'react'
import { connect } from 'react-redux'

class Profile extends React.Component {
    render() {
        const { props } = this;
        const user = props.members.find(member => member.id === props.id);
        const patron = props.patrons.find(tier => tier.list.find(p => p.steamid === user.id) ? { tier: tier.tier, description: tier.description } : false)

        return (
            <div className='flex-column'>
                <div className='wrapper-description'>
                    <div className='page-description'>
                        <div className='flex-row'>
                            <h1>{ user.name }</h1>
                            {
                                patron
                                    ? <div className='profile-patron' title={ `This user is a tier ${patron.description.toUpperCase()} supporter` }><i className='fas fa-medal' /> { patron.description.toUpperCase() } </div>
                                    : ''
                            }
                        </div>
                        <div className="profile-basic flex-row">
                            <img src={ user.avatar }
                                className={ `profile-avatar ${ patron ? `tier${patron.tier}` : ''}` }
                                alt="avatar" />
                            <div>Currently there's no info provided about this user.</div>
                        </div>
                        <div className='flex-row'>
                            <div></div>
                            <div className='profile-date'>
                                {
                                    Date.now() - user.updated > 3600000
                                        ? <button className='custom-button'>Update</button>
                                        : `Last updated: ${new Date(user.updated).toLocaleString()}`
                                }
                            </div>
                        </div>
                    </div>
                    <div className='flex-column'>
                        <h2>Badges</h2>
                    </div>
                    <div className='flex-column'>
                        <h2>Statistics</h2>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ 
    members: state.members,
    patrons: state.patrons,
    id: state.profileID
})

export default connect(
    mapStateToProps
)( Profile )