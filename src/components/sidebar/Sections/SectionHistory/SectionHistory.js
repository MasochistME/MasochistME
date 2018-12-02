import React from 'react'
import { connect } from 'react-redux'

class SectionHistory extends React.Component {
    sortEvents = (event, eventIndex) => {
        const player = this.props.members.find(m => Number(m.id) === Number(event.player))
        const game = this.props.games.find(g => Number(g.id) === Number(event.game))

        switch (event.type) {
            case 'newMember':
                return player
                    ? (
                    <p className='small-event' key={ `sidebar-event-${eventIndex}` }>
                        <span className="bold">- {player.name}</span> has joined the group!
                    </p>)
                    : null
            case 'newGame':
                return game
                    ? (
                    <p className='small-event' key={ `sidebar-event-${eventIndex}` }>
                        <span className="bold">- {game.title}</span> has been curated!
                    </p>)
                    : null
            case 'complete':
                return player && game
                    ? (
                    <p className='small-event' key={ `sidebar-event-${eventIndex}` }>
                        <span className="bold">- {player.name}</span> 100%'d <span className="bold">{game.title}</span>!
                    </p>)
                    : null
            default: return null
        }
    }

    render() {
        const { props } = this;

        return (
        <div className='section'>
            <h3 className='section-title'>Last 10 events</h3>
                { props.events
                    .slice(0,10)
                    .map((event, eventIndex) => this.sortEvents(event, eventIndex) )}
        </div>)
    }
}


const mapStateToProps = state => ({ 
    events: state.events,
    games: state.games,
    members: state.members
})

export default connect(
  mapStateToProps
)( SectionHistory )