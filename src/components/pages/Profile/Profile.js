import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import axios from 'axios'

const summarizeTotalTime = games => {
    let sum = 0;
    games.map(game => sum = sum + parseInt(game.playtime_forever))
    return sum;
}

const sendUpdateRequest = (id) => {
    let url = `/rest/users/user/${id}`;
    axios.put(url)
        .then(res => console.log(res.data.content))
        .catch(err => console.log(err));
}

class Profile extends React.Component {
    render() {
        const { props } = this;
        const user = props.members.find(member => member.id === props.id);
        const patron = props.patrons.find(tier => tier.list.find(p => p.steamid === user.id) ? { tier: tier.tier, description: tier.description } : false);
        const games = props.games;
        const badges = _.orderBy(
            props.badges
                .filter(badge => user.badges.find(b => b.id === badge._id))
                .map(badge => badge = {...badge, game: games.find(game => game.id === badge.gameId).title})
            , ['points'], ['desc']);

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
                                        ? <button className='custom-button' onClick={() => sendUpdateRequest(user.id) }>Update</button>
                                        : `Last updated: ${new Date(user.updated).toLocaleString()}`
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='wrapper-profile'>
                    <div className='flex-column'>
                        <h2>Badges</h2>
                        <div className='flex-row' style={{ justifyContent: 'flex-start' }}>
                            {
                                badges.map((badge, index) => <img 
                                    className='profile-badge' 
                                    src={ badge.img } 
                                    alt='badge' 
                                    title={ `${badge.game.toUpperCase()}\n${badge.name}\n"${badge.description}"` } 
                                    key={ `badge-${index}`}/>)
                            }
                        </div>
                    </div>
                    <div className='flex-column'>
                        <h2>Statistics</h2>
                        <ul>
                            <li>Total time spent playing curated games: { summarizeTotalTime(user.games) } h</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ 
    members: state.members,
    patrons: state.patrons,
    badges: state.badges,
    games: state.games,
    id: state.profileID
})

export default connect(
    mapStateToProps
)( Profile )