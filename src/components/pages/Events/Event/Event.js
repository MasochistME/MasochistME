import React from 'react'
import { connect } from 'react-redux'
import { swapRatingToIcon } from '../../../../shared/helpers/helper'
import logo from '../../../../shared/images/logo.png'

class GameEvent extends React.Component {
    render() {
        const { props } = this
        const game = props.games.find(g => Number(g.id) === Number(props.event.game))
        const rating = props.rating.find(r => game ? Number(r.score) === Number(game.rating) : null)

        return (
            <div className="event-info flex-row">
                <img className="event-img" alt="game-img" src={ logo }></img>
                {
                    game
                        ? <div className="event-desc"><span className="bold">{ game ? game.title : `Game ${props.event.game}` }</span> has been curated!</div>
                        : <div className="event-desc"><span className="bold">{ game ? game.title : `Game ${props.event.game}` }</span> (no longer curated) has been curated!</div>
                }
                
                <div className="event-summary flex-row">
                    <i className="fas fa-plus-square"></i> 
                    <i className={ rating ? rating.link : "far fa-question-circle" }></i> 
                    <img className="event-img" alt="game-img" src={ game ? game.img : logo }></img>
                </div>
            </div>
        )
    }
}
const MemberEvent = props => {
    const member = props.members.find(m => Number(m.id) === Number(props.event.player))

    return (
        <div className="event-info flex-row">
            <img className="event-img" alt="avatar" src={ member ? member.avatar : logo }></img>
            {
                member
                    ? <div className="event-desc"><span className="bold">{ member ? member.name : `User ${props.event.player}` }</span> has joined the group!</div>
                    : <div className="event-desc"><span className="bold">{ member ? member.name : `User ${props.event.player}` }</span> (no longer member of the group) has joined the group!</div>
            }
            <div className="event-summary flex-row">
                <i className="fas fa-user-plus"></i>
                <img className="event-img" alt="game-img" src={ logo }></img>
            </div>
        </div>
    )
}
const CompleteEvent = props => {
    const member = props.members.find(m => Number(m.id) === Number(props.event.player))
    const game = props.games.find(g => Number(g.id) === Number(props.event.game))
    const rating = props.rating.find(r => game ? Number(r.score) === Number(game.rating) : null)

    return (
        <div className="event-info flex-row">
            <img className="event-img" src={ member ? member.avatar : logo } alt="game-img"></img>
            {
                member 
                    ? game //member yes
                        ? <div className="event-desc"><span className="bold">{ member ? member.name : `User ${props.event.player}` }</span> 100%'d <span className="bold">{ game ? game.title : `game ${props.event.game}` }</span>!</div>
                        : <div className="event-desc"><span className="bold">{ member ? member.name : `User ${props.event.player}` }</span> 100%'d <span className="bold">{ game ? game.title : `game ${props.event.game}` }</span> (no longer curated)!</div>
                    : game //member no
                        ? <div className="event-desc"><span className="bold">{ member ? member.name : `User ${props.event.player}` }</span> (no longer member of the group) 100%'d <span className="bold">{ game ? game.title : `game ${props.event.game}` }</span>!</div>
                        : <div className="event-desc"><span className="bold">{ member ? member.name : `User ${props.event.player}` }</span> (no longer member of the group) 100%'d <span className="bold">{ game ? game.title : `game ${props.event.game}` }</span> (no longer curated)!</div>
            }
            
            <div className="event-summary flex-row">
                <i class="fas fa-check-square"></i>
                <i className={ rating ? rating.link : "far fa-question-circle" }></i>
                <img className="event-img" src={ game ? game.img : logo } alt="game-img"></img>
            </div>
        </div>
    )
}
const TierChangeEvent = props => {
    const game = props.games.find(g => Number(g.id) === Number(props.event.game))
    const rating = props.rating.find(r => game ? Number(r.score) === Number(game.rating) : null)
    const demoted = props.event.oldTier > props.event.newTier

    return (
        game && rating
            ? <div className="event-info flex-row">
                <img className="event-img" alt="game-img" src={ logo }></img>
                <div className="event-desc">
                    <span className="bold">{ game ? game.title : "-" }</span> 
                    { demoted ? " demoted " : " promoted " }
                    from <i className={ swapRatingToIcon(props.event.oldTier, props.rating) }></i> to <i className={ swapRatingToIcon(props.event.newTier, props.rating) }></i>!
                </div>
                <div className="event-summary flex-row">
                    { demoted
                        ? <i className="fas fa-caret-square-down"></i> 
                        : <i className="fas fa-caret-square-up"></i> 
                    }
                    <i className={ rating ? rating.link : "far fa-question-circle" }></i> 
                    <img className="event-img" alt="game-img" src={ game ? game.img : logo }></img>
                </div>
            </div>
            : null
    )
}
const AchievementNumberChangeEvent = props => {
    const game = props.games.find(g => Number(g.id) === Number(props.event.game))
    const rating = props.rating.find(r => game ? Number(r.score) === Number(game.rating) : null)

    return (
        game && rating
            ? <div className="event-info flex-row">
                <img className="event-img" alt="game-img" src={ logo }></img>
                <div className="event-desc">
                    <span className="bold">{ game ? game.title : "-" } </span>
                    {
                        props.event.oldNumber < props.event.newNumber
                            ? `got ${props.event.newNumber - props.event.oldNumber} new achievements!`
                            : `had ${props.event.oldNumber - props.event.newNumber} achievements removed!`
                    }
                    
                </div>
                <div className="event-summary flex-row">
                    <i className="fas fa-tasks"></i> 
                    <i className={ rating ? rating.link : "far fa-question-circle" }></i> 
                    <img className="event-img" alt="game-img" src={ game ? game.img : logo }></img>
                </div>
            </div>
            : null
    )
}

class Event extends React.Component {
    sortEvents = event => {
        switch (event.type) {
            case "newGame": return <GameEvent event={ event } games={ this.props.games } rating={ this.props.rating } />
            case "newMember": return <MemberEvent event={ event } members={ this.props.members } />
            case "complete": return <CompleteEvent event={ event } games={ this.props.games } members={ this.props.members } rating={ this.props.rating } />
            case "tierChange": return <TierChangeEvent event={ event } games={ this.props.games } rating={ this.props.rating } />
            case "achievementNumberChange": return <AchievementNumberChangeEvent event={ event } games={ this.props.games } rating={ this.props.rating } />
            default: return
        }
    }

    render() {
        const { props } = this
        const event = this.sortEvents(props.event)
        console.log(event)
        return (
            event
                ? <li 
                    className="event flex-row"
                    key={ `event-${Date.now()}` }
                >
                    <div className="event-date"> { new Date(props.event.date).toLocaleString() } </div>
                    { event }
                </li>
                : null
        )
    }
}

const mapStateToProps = state => ({ 
    games: state.games,
    members: state.members,
    rating: state.rating
})

export default connect(
  mapStateToProps
)( Event )