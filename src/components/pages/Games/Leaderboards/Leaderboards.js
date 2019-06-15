import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import LeaderboardsProgressBar from './LeaderboardsProgressBar'

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
            .map(entry => sum += entry.playtime)
        let average = Math.round(sum/completed.length)
        return Number.isNaN(average) ? "no known completion times" : `${average} h`
    }

    render() {
        const { props } = this
        const visible = props.show
        const game = props.game
        let leaderboards = props.members
            .filter(member => member.games.find(g => Number(g.appid) === Number(game.id)))
            .map(member => {
                const memberGameStats = member.games.find(g => Number(g.appid) === Number(game.id))
                return memberGameStats
                    ? {
                        id: member.id,
                        name: member.name,
                        avatar: member.avatar,
                        gameId: game.id,
                        completionRate: memberGameStats.completionRate,
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
                            { game.title } <i class="fas fa-external-link-alt"></i>
                        </a>
                    </h2>
                    <div className="game-statistics">
                        <ul>
                            <li>Average completion time: { this.summarizeCompletionTime(leaderboards) }</li>
                            <li>Number of completions: { this.summarizeCompletions(leaderboards) }</li>
                        </ul>
                    </div>
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
    members: state.members
})

export default connect(
    mapStateToProps
)( Leaderboards ) 