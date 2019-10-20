import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import LeaderboardsProgressBar from './LeaderboardsProgressBar'
import StackedBarChart from '../../../Charts/StackedBarChart'
import ChartWrapper from '../../../Charts/ChartWrapper'

class Leaderboards extends React.Component {
    assignTrophyIfDeserved = (leaderboards, index) => {
        if (leaderboards.completionRate !== 100)
            return ''
        switch(index) {
            case 0: return '🥇'
            case 1: return '🥈'
            case 2: return '🥉'
            default: return ''
        }
    }

    assignDateIfFinished = leaderboards => {
        return leaderboards.completionRate === 100
            ? new Date(leaderboards.lastUnlocked*1000).toLocaleString()
            : null
    }

    summarizeCompletions = leaderboard => {
        let sum = 0
        leaderboard
            .filter(member => member.completionRate === 100)
            .map(entry => sum = sum+1)
        return sum
    }

    summarizeCompletionTime = leaderboard => {
        let sum = 0;
        let completed = leaderboard
            .filter(member => member.completionRate === 100)
            .map(entry => sum += parseInt(entry.playtime ? entry.playtime.replace(',','') : 0)*60);
        let average = Math.round((sum/60)/completed.length);
        
        return Number.isNaN(average) ? 0 : average
    }

    summarizeCompletionTimeAll = (games, members, rating) => {
        let sum = 0;
        let number = 0;
        const gameIDs = games.filter(game => game.rating === rating)
            .map(game => game.id)
        members.map(member => {
            member.games.map(game => {
                if (gameIDs.find(g => g == game.appid)) {
                    sum = sum + parseInt(game.playtime_forever);
                    number = number + 1;
                }
                return game;
            })
            return member;
        })
        if (sum !== 0 && number !== 0)
            return parseInt(sum / number);
        else return 0;        
    }

    render() {
        const { props } = this;
        const visible = props.show;
        const { game, games, members, rating } = this.props;
        const badges = _.orderBy(
            this.props.badges
                .filter(badge => badge.gameId === game.id)
                .map(badge => badge = {
                    ...badge, 
                    game: badge.isNonSteamGame
                        ? badge.game
                        : games.find(game => game.id === badge.gameId).title
                    })
            , ['points'], ['desc']);

        let leaderboards = props.members
            .filter(member => member.member)
            .filter(member => member.games.find(g => Number(g.appid) === Number(game.id)))
            .map(member => {
                const memberGameStats = member.games.find(g => Number(g.appid) === Number(game.id))
                return memberGameStats
                    ? {
                        id: member.id,
                        name: member.name,
                        avatar: member.avatar,
                        gameId: game.id,
                        completionRate: memberGameStats.completionRate ? memberGameStats.completionRate : 0,
                        lastUnlocked: memberGameStats.lastUnlocked,
                        playtime: memberGameStats.playtime_forever
                    }
                    : null
            })
        leaderboards = _.orderBy(leaderboards, ['completionRate', 'lastUnlocked'], ['desc', 'asc'])

        return (
            visible
                ? <div className="leaderboards">
                    <h2>
                        <a href={ `https://store.steampowered.com/app/${ game.id }` } target='_blank' rel='noopener noreferrer' >
                            { game.title } <i className="fas fa-external-link-alt"></i>
                        </a>
                    </h2>
                    <div className="game-statistics">
                        <ChartWrapper 
                            title={[ `Completions: ${this.summarizeCompletions(leaderboards)}`, `Average completion time` ]}
                        >
                            <StackedBarChart 
                                labels={ [ 'hours' ] }
                                datasets={ [ {
                                    label: 'this game',
                                    data: [ this.summarizeCompletionTime(leaderboards) ],
                                    colorNormal: '#e30000ff',
                                    colorTransparent: '#e3000033'
                                }, {
                                    label: 'games from this tier', 
                                    data: [ this.summarizeCompletionTimeAll(games, members, rating) ],
                                    colorNormal: '#141620ff',
                                    colorTransparent: '#14162066',
                                } ]}
                            />
                        </ChartWrapper>
                    </div>
                    {
                        badges.length > 0
                            ? <div className="game-badges">
                                <div className='profile-section flex-column'>
                                    <h3 className='profile-section-title'>Badges</h3>
                                    <div className='flex-column' style={{ width: '100%', height: '100%', padding: '10px', boxSizing: 'border-box' }}>
                                        {
                                            badges.map((badge, index) => (
                                                <div className='badge-description flex-column'>
                                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{badge.name.toUpperCase()}</p>
                                                    <div className='flex-row' style={{ width: '100%' }}>
                                                        <img 
                                                            className='profile-badge'
                                                            style={{ margin: '5px 10px 5px 5px' }}
                                                            src={ badge.img } 
                                                            alt='badge' 
                                                            key={ `badge-${index}`}/>
                                                            <div className='flex-column' style={{ width: '100%' }}>
                                                                <p className='badge-field'>Points: {badge.points} pts</p>
                                                                <p className='badge-field'>Proof: {badge.requirements}</p>
                                                                <p className='badge-field'>Description: {badge.description}</p>
                                                            </div>
                                                        </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            : null
                    }
                    <ul className="game-leaderboards">
                    {
                        leaderboards
                            .map((member, memberIndex) => (
                                <li className='leaderboards-member flex-row'>
                                    <img className='leaderboards-member-image' alt='avatar' src={ member.avatar }></img>
                                    <div className='leaderboards-member-info flex-row'>
                                        <div className='leaderboards-member-name'>{ this.assignTrophyIfDeserved(member, memberIndex) + member.name }</div>                                        
                                        <div className='leaderboards-member-times'>{ this.assignDateIfFinished(member) }</div>
                                    </div>
                                    <LeaderboardsProgressBar percentage={ Math.floor(member.completionRate) }/>
                                </li>
                            ))
                    }
                    </ul>
                </div>
                : null
        )
    }
}


const mapStateToProps = state => ({ 
    members: state.members,
    games: state.games,
    badges: state.badges
})

export default connect(
    mapStateToProps
)( Leaderboards ) 