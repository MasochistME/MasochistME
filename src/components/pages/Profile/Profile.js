import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import axios from 'axios'
import DoughnutChart from '../../Charts/DoughnutChart';

const sendUpdateRequest = (id) => {
    let url = `/rest/users/user/${id}`;
    axios.put(url)
        .then(res => console.log(res.data.content))
        .catch(err => console.log(err));
}

class Profile extends React.Component {
    constructor() {
        super();
        this.state = { updating: false }
    }
    render() {
        const { props } = this;
        const user = props.members.find(member => member.id === props.id);
        const patron = props.patrons.find(tier => tier.list.find(p => p.steamid === user.id) ? { tier: tier.tier, description: tier.description } : false);
        const games = props.games;
        const rating = props.rating;
        const badges = _.orderBy(
            props.badges
                .filter(badge => user.badges.find(b => b.id === badge._id))
                .map(badge => badge = {...badge, game: games.find(game => game.id === badge.gameId).title})
            , ['points'], ['desc']);

        const summarizeTotalTimes = (type, scope) => {
            let data = [
                // {
                //     sum: 0,
                //     label: 'Total',
                //     id: 'total'
                // }
            ];

            rating.map(r => data.push({
                sum: 0,
                label: r.symbol,
                id: r.id
            }));
            
            if (scope === 'completed')
                user.games = user.games.filter(game => game.completionRate === 100)

            user.games.map(game => {
                // data[0].sum = data[0].sum + parseInt(game.playtime_forever);
                return { ...game, rating: games.find(g => parseInt(g.id) === game.appid).rating };
            }).map(game => {
                const index = data.findIndex(d => d.id === game.rating);
                data[index].sum += parseInt(game.playtime_forever);
                return game;
            });

            if (type === 'labels') {
                return data.map(d => d.label)
            }
            if (type === 'data') {
                return data.map(d => d.sum)
            }
            else {
                return []
            }
        }

        const summarizeTotalGames = type => {
            let data = [];

            rating.map(r => data.push({
                sum: 0,
                label: r.symbol,
                id: r.id
            }));
            
            user.games.filter(game => game.completionRate === 100)
                .map(game => {
                    return { ...game, rating: games.find(g => parseInt(g.id) === game.appid).rating }})
                .map(game => {
                    const index = data.findIndex(d => d.id === game.rating);
                    data[index].sum += 1;
                    return game;
                });
            if (type === 'labels') {
                return data.map(d => d.label)
            }
            if (type === 'data') {
                return data.map(d => d.sum)
            }
            else {
                return []
            }
        }

        return (
            <div className='flex-column'>
                <div className='wrapper-description'>
                    <div className='page-description' style={{ paddingBottom: '0', marginBottom: '0' }}>
                        <div className='flex-row'>
                            <h1 style={{ margin: '0' }}>{ user.name }</h1>
                            {
                                patron
                                    ? <div className='profile-patron' title={ `This user is a tier ${patron.description.toUpperCase()} supporter` }><i className='fas fa-medal' /> { patron.description.toUpperCase() } </div>
                                    : ''
                            }
                        </div>
                        <div className='profile-date flex-row' style={{ marginBottom: '5px' }}>
                            { `Last updated: ${new Date(user.updated).toLocaleString()}` }
                            {
                                Date.now() - user.updated > 3600000
                                    ? <button className='custom-button' onClick={() => sendUpdateRequest(user.id) }>Update</button>
                                    : <button className='custom-button button-blocked' title={ `${parseInt((3600000 - (Date.now()-user.updated))/60000)} minutes till you can update again` }>Update</button>
                            }
                        </div>
                        <div className="profile-basic flex-row">
                            <img src={ user.avatar }
                                className={ `profile-avatar ${ patron ? `tier${patron.tier}` : ''}` }
                                alt="avatar" />
                            <div>Currently there's no info provided about this user.</div>
                        </div>
                    </div>
                </div>
                <div className='wrapper-profile'>
                    <div className='profile-badges'>
                        {
                            badges.map((badge, index) => <img 
                                className='profile-badge' 
                                src={ badge.img } 
                                alt='badge' 
                                title={ `${badge.game.toUpperCase()}\n${badge.name}\n"${badge.description}"` } 
                                key={ `badge-${index}`}/>)
                        }
                    </div>
                    <div className='flex-column'>
                        <div className='profile-graphs'>
                            <DoughnutChart 
                                title='HOURS PLAYED (TOTAL)'
                                labels={ summarizeTotalTimes('labels', 'total') }
                                dataset={ summarizeTotalTimes('data', 'total') }
                            />
                            <DoughnutChart 
                                title='HOURS PLAYED (COMPLETED)'
                                labels={ summarizeTotalTimes('labels', 'completed') }
                                dataset={ summarizeTotalTimes('data', 'completed') }
                            />
                            <DoughnutChart 
                                title='GAMES COMPLETED'
                                labels={ summarizeTotalGames('labels') }
                                dataset={ summarizeTotalGames('data' ) }
                            />
                        </div>
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
    rating: state.rating,
    id: state.profileID
})

export default connect(
    mapStateToProps
)( Profile )