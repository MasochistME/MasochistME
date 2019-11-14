import React from 'react'
import _ from 'lodash'
import moment from 'moment';
import { connect } from 'react-redux'
import axios from 'axios'
import DoughnutChart from '../../Charts/DoughnutChart';
import LineChart from '../../Charts/LineChart';
import ChartWrapper from '../../Charts/ChartWrapper/index';

const summarizeTotalTimes = (type, scope, rating, user, games) => {
    let data = [
        // {
        //     sum: 0,
        //     label: 'Total',
        //     id: 'total'
        // }
    ];
    let userGames = user.games;

    rating.map(r => data.push({
        sum: 0,
        label: r.symbol,
        id: r.id
    }));
    
    if (scope === 'completed')
        userGames = userGames.filter(game => game.completionRate === 100)

    userGames
        .filter(game => games.find(g => parseInt(g.id) === game.appid))
        .map(game => {
            game = { 
                ...game, 
                rating: games.find(g => parseInt(g.id) === game.appid).rating 
            };
            const index = data.findIndex(d => d.id === game.rating);
            data[index].sum += parseInt(game.playtime_forever);
            return game;
    });

    return data.map(d => d[type])
}
const summarizeTotalGames = (type, rating, user, games) => {
    let data = [];

    rating.map(r => data.push({
        sum: 0,
        label: r.symbol,
        id: r.id
    }));
    
    user.games
        .filter(game => game.completionRate === 100 && games.find(g => parseInt(g.id) === game.appid))            
        .map(game => {
            game = {
                ...game, 
                rating: games.find(g => parseInt(g.id) === game.appid).rating 
            };
            const index = data.findIndex(d => d.id === game.rating);
            data[index].sum += 1;
            return game;
        });
    return data.map(d => d[type])
}
const getTimelines = (type, rating, user, games) => {
    let data = [ ];
    let gamesTotal = 0;
    let pointsTotal = 0;
    var startDate = 0;
    var endDate = 0;

    let timelines = user.games.filter(game => game.completionRate === 100);
    timelines = _.orderBy(timelines, ['lastUnlocked'], ['asc']);

    startDate = moment(new Date(timelines[0].lastUnlocked * 1000));
    endDate = moment(new Date(timelines[timelines.length - 1].lastUnlocked * 1000));

    while (startDate.isBefore(endDate)) {
        data.push({
            label: startDate.format("YYYY-MM"),
            games: 0,
            points: 0
        });
        startDate.add(1, 'month');
    }
    
    data = data
        .map(date => {
            const gamesCompletedInMonth = timelines
                .filter(game => {
                    const month = new Date(game.lastUnlocked*1000).getMonth() + 1;
                    const year = new Date(game.lastUnlocked*1000).getFullYear(); 
                    return date.label === `${year}-${month < 10 ? `0${month}` : month}` && games.find(g => parseInt(g.id) === game.appid);
                }).map(game => {
                    try {
                        date.points += rating.find(r => r.id === games.find(g => parseInt(g.id) === game.appid).rating).score;
                    }
                    catch (err) {
                        console.log(err);
                        date.points = 0;
                    }
                    return game;
                })
        if (gamesCompletedInMonth.length !== 0) {
            gamesTotal = gamesTotal + gamesCompletedInMonth.length;
            pointsTotal = pointsTotal + date.points;
        }
        date.games = gamesTotal;
        date.points = pointsTotal;
        return date;
    })

    return data.map(d => d[type])
}

class Profile extends React.Component {
    constructor() {
        super();
        this.state = { 
            updating: false,
            message: ''
        }
    }

    sendUpdateRequest = (id) => {
        let url = `/rest/users/user/${id}`;
        this.setState({ 
            updating: true,
            message: 'Updating... refresh in a few minutes'
        });
        axios.put(url)
            .then(res => {
                if (res.data) {
                    this.setState({ message: res.data })
                }
            })
            .catch(err => console.log(err));
    }

    componentDidMount() {
        window.scrollTo(0, 0);
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
                .map(badge => badge = {
                    ...badge, 
                    game: badge.isNonSteamGame
                        ? badge.game
                        : games.find(game => game.id === badge.gameId) ? games.find(game => game.id === badge.gameId).title : 'unknown'
                    })
            , ['points'], ['desc']);

        return (
            <div className='flex-column'>
                <div className='wrapper-description'>
                    <div className='page-description' style={{ paddingBottom: '0', marginBottom: '0' }}>
                        <div className='flex-row'>
                            <h1 style={{ margin: '0' }}>
                                <a href={ `https://steamcommunity.com/profiles/${user.id}` } target='_blank' rel='noopener noreferrer'>
                                    <i className="fab fa-steam" style={{ marginRight: '10px' }} />
                                    { user.name } 
                                </a>
                            </h1>
                            {
                                patron
                                    ? <div className='profile-patron' title={ `This user is a tier ${patron.description.toUpperCase()} supporter` }><i className='fas fa-medal' /> { patron.description.toUpperCase() } </div>
                                    : ''
                            }
                        </div>
                        <div className='profile-date flex-row' style={{ marginBottom: '5px' }}>
                            { <span>{`Last updated: ${user.updated === 0 ? 'never' : new Date(user.updated).toLocaleString()}`}</span> }
                            {
                                Date.now() - user.updated > 3600000
                                    ? this.state.updating
                                        ? <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px' }}>{ this.state.message }</span>
                                        : <button className='custom-button' onClick={() => this.sendUpdateRequest(user.id) }>Update</button>
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
                <div className='wrapper-profile flex-column'>
                    {
                        badges.length !== 0
                            ? <div className='profile-badges'>
                                <div className='profile-section' style={{ width: '100%' }}>
                                    <h3 className='profile-section-title'>Badges</h3>
                                    <div style={{ width: '100%', display: 'flex', flexFlow: 'row wrap', justifyContent: 'center' }}>
                                    {
                                        badges.map((badge, index) => <img 
                                            className='profile-badge' 
                                            src={ badge.img } 
                                            alt='badge' 
                                            title={ `${badge.game.toUpperCase()} - ${badge.name} (${badge.points} pts)\n"${badge.description}"` } 
                                            key={ `badge-${index}`}/>)
                                    }
                                    </div>
                                </div>
                            </div>
                            : null
                    }
                    {
                        !isNaN(user.points) && user.points !== 0
                        ? <div className='profile-graphs'>
                            <ChartWrapper title='HOURS PLAYED (TOTAL)'>
                                <DoughnutChart 
                                    labels={ summarizeTotalTimes('label', 'total', rating, user, games) }
                                    dataset={ summarizeTotalTimes('sum', 'total', rating, user, games) }
                                />
                            </ChartWrapper>
                            <ChartWrapper title='HOURS PLAYED (COMPLETED)'>
                                <DoughnutChart 
                                    labels={ summarizeTotalTimes('label', 'completed', rating, user, games) }
                                    dataset={ summarizeTotalTimes('sum', 'completed', rating, user, games) }
                                />
                            </ChartWrapper>
                            <ChartWrapper title='GAMES COMPLETED'>
                                <DoughnutChart 
                                    labels={ summarizeTotalGames('label', rating, user, games) }
                                    dataset={ summarizeTotalGames('sum', rating, user, games) }
                                />
                            </ChartWrapper>
                            <ChartWrapper title='COMPLETION TIMELINE' width='100' >
                                <LineChart
                                    labels={ getTimelines('label', rating, user, games) }
                                    datasets={ [{
                                            label: 'games',
                                            data: getTimelines('games', rating, user, games) 
                                        },
                                        {
                                            label: 'points',
                                            data: getTimelines('points', rating, user, games) 
                                        }]
                                    }
                                />
                            </ChartWrapper>
                        </div>
                        : null
                    }
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