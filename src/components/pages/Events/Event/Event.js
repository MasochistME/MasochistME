import React from 'react'
import { connect } from 'react-redux'
import logo from '../../../../shared/images/logo.png'

class GameEvent extends React.Component {
    render() {
        const { props } = this
        const game = props.games.find(g => Number(g.id) === Number(props.event.game))
        const rating = props.rating.find(r => Number(r.score) === Number(game.rating))
        return (
            <div className="event-info flex-row">
                <img className="event-img" alt="game-img" src={ logo }></img>
                <div className="event-desc"><span className="bold">{ game ? game.title : "-" }</span> has been curated!</div>
                <div className="event-summary flex-row">
                    <i className="fas fa-plus-square"></i> 
                    <i className={ rating ? rating.link : "far fa-question-circle" }></i> 
                    <img className="event-img" alt="game-img" src={ game ? game.img : "" }></img>
                </div>
            </div>
        )
    }
}

class MemberEvent extends React.Component {
    render() {
        const { props } = this
        const member = props.members.find(m => Number(m.id) === Number(props.event.player))
        return (
            <div className="event-info flex-row">
                <img className="event-img" alt="avatar" src={ member ? member.avatar : "" }></img>
                <div className="event-desc"><span className="bold">{ member ? member.name : "-" }</span> has joined the group!</div>
                <div className="event-summary flex-row">
                    <i className="fas fa-user-plus"></i>
                    <img className="event-img" alt="game-img" src={ logo }></img>
                </div>
            </div>
        )
    }
}
class CompleteEvent extends React.Component {
    render() {
        const { props } = this
        const member = props.members.find(m => Number(m.id) === Number(props.event.player))
        const game = props.games.find(g => Number(g.id) === Number(props.event.game))
        const rating = props.rating.find(r => Number(r.score) === Number(game.rating))

        return (
            <div className="event-info flex-row">
                <img className="event-img" src={ member ? member.avatar : "" } alt="game-img"></img>
                <div className="event-desc"><span className="bold">{ member ? member.name : "-" }</span> 100%'d <span className="bold">{ game ? game.title : "-" }</span>!</div>
                <div className="event-summary flex-row">
                    <i class="fas fa-check-square"></i>
                    <i className={ rating ? rating.link : "far fa-question-circle" }></i>
                    <img className="event-img" src={ game.img } alt="game-img"></img>
                </div>
            </div>
        )
    }
}

class Event extends React.Component {
    sortEvents = event => {
        switch (event.type) {
            case "newGame": return <GameEvent event={ event } games={ this.props.games } rating={ this.props.rating } />
            case "newMember": return <MemberEvent event={ event } members={ this.props.members } />
            case "complete": return <CompleteEvent event={ event } games={ this.props.games } members={ this.props.members } rating={ this.props.rating } />
            default: return
        }
    }

    render() {
        const { props } = this

        return (
            <li 
                className="event flex-row"
                key={ `event-${Date.now()}` }
            >
                <div className="event-date"> { new Date(props.event.date).toLocaleString() } </div>
                { this.sortEvents(props.event) }
            </li>
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