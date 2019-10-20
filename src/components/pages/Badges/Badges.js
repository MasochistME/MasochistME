import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

class PageBadges extends React.Component {
    render() {
        const games = this.props.games;
        const badges = _.orderBy(
            this.props.badges
                .map(badge => badge = {
                    ...badge, 
                    game: badge.isNonSteamGame
                        ? badge.game
                        : games.find(game => game.id === badge.gameId).title
                    })
            , ['gameId'], ['desc']);

        return (
            <div className='flex-column'>
                <div className='wrapper-description'>
                    <div className='page-description'>
                        <p>This is the list showcasing the last 100 events.</p>
                        <p>There are six different types of events:</p>
                </div>
            </div>
                <div className="wrapper-events">
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
        )
    }
}

const mapStateToProps = state => ({ 
    games: state.games,
    badges: state.badges
})

export default connect(
  mapStateToProps
)( PageBadges )