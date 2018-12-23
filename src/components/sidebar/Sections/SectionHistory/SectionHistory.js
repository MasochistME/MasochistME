import React from 'react'
import { connect } from 'react-redux'
import { swapRatingToIcon } from '../../../../shared/helpers/helper'

class SectionHistory extends React.Component {
    sortEvents = (event, eventIndex) => {
        const player = this.props.members.find(m => Number(m.id) === Number(event.player))
        const game = this.props.games.find(g => Number(g.id) === Number(event.game))
        const rating = this.props.rating

        switch (event.type) {
            case 'newMember':
                return player
                    ? (
                    <p className='small-event' key={ `sidebar-event-${eventIndex}` }>
                        <i className="fas fa-user-plus"></i><span className="bold"> {player.name}</span> has joined the group!
                    </p>)
                    : null
            case 'newGame':
                return game
                    ? (
                    <p className='small-event' key={ `sidebar-event-${eventIndex}` }>
                        <i className="fas fa-plus-square"></i><span className="bold"> {game.title}</span> has been curated!
                    </p>)
                    : null
            case 'complete':
                return player && game
                    ? (
                    <p className='small-event' key={ `sidebar-event-${eventIndex}` }>
                        <i className="fas fa-check-square"></i><span className="bold"> {player.name}</span> completed <span className="bold">{game.title}</span>!
                    </p>)
                    : null
            case 'tierChange':
                return game
                    ? (
                    <p className='small-event' key={ `sidebar-event-${eventIndex}` }>
                        <i className="fas fa-undo-alt"></i><span className="bold"> {game.title}</span> changed its tier to <icon className={ swapRatingToIcon(game.rating, rating) }></icon>!
                    </p>)
                    : null
            case 'achievementNumberChange':
                return game
                    ? (
                    <p className='small-event' key={ `sidebar-event-${eventIndex}` }>
                        <i className="fas fa-tasks"></i>
                        <span className="bold"> {game.title}</span> {
                            event.oldNumber < event.newNumber
                                ? `got ${event.newNumber - event.oldNumber} new achievements!`
                                : `had ${event.oldNumber - event.newNumber} achievements removed!`
                        }
                    </p>)
                    : null
            default: return null
        }
    }

    render() {
        const { props } = this;

        return (
        <div className='section'>
            <h3 className='section-title'>Last events</h3>
                { props.events
                    .slice(0,10)
                    .map((event, eventIndex) => this.sortEvents(event, eventIndex) )}
        </div>)
    }
}


const mapStateToProps = state => ({ 
    events: state.events,
    games: state.games,
    members: state.members,
    rating: state.rating
})

export default connect(
  mapStateToProps
)( SectionHistory )