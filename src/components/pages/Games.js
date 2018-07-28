import React from 'react'
import games from '../../mock/games' //THIS IS FOR DEV PURPOSES - GONNA BE CHANGED TO JSON DOWNLOADED FRMO THE SERVER

const swapRatingToIcon = rating => {
    switch (rating) {
        case 1: return '✓'
        case 2: return '☆'
        case 3: return '✪'
        case 5: return '★'
        default: return '✓'
    }
}

export default class PageGames extends React.Component{
    render() {
        return (
            <div className='wrapper-games'>
                {
                    games.map(game => 
                        <div 
                            key={ `id-game-${game.id}` }
                            className={ `game rated-${game.rating}` }
                            style={{ backgroundImage:`url(${game.img})`}}
                            >                     
                            <div
                                className='game-info'
                            >
                                <div className='game-rating'>{ swapRatingToIcon(game.rating) }</div>
                                <div className='game-title'>{ game.title }</div>
                                <div className='game-desc'>{ game.desc }</div>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}