import React from 'react'
import rating from '../../config/rating'
import games from '../../mock/games' //THIS IS FOR DEV PURPOSES - GONNA BE CHANGED TO JSON DOWNLOADED FRMO THE SERVER

const swapRatingToIcon = score => rating.find(r => r.score === score).icon

class CheckBoxGameChoice extends React.Component{
    render() {
        const score = this.props.score
        const icon = swapRatingToIcon(score)
        return (
            <div>
                <input name="game" value={ score } id={ `game-choice-${ score }` } className="game-choice-checkbox" type="checkbox" checked />
                <label for={ `game-choice-${ score }` }>show { icon } games</label>
            </div>
        )
    }
}

export default class PageGames extends React.Component{
    render() {
        return (
            <div className='flex-column'>
                <div className='wrapper-description'>
                    <div className='page-description'>
                        <p>Here's the list of games that 0.1% curates, as well as the percentage completion comparision between our members.</p>
                        <p>In the 0.1% community, we grade the ranks of our members by how many curated games they've completed, as well as the difficulty of those games (rated with 1, 2, 3 or 5 points). Each game specifies on their description their own difficulty.</p>
                        <p>The list also includes which three members completed the game first (with a gold, silver and bronze medals, respectively), as well as the member who has completed it the fastest based on Steam timestamps (with a trophy).</p>
                    </div>
                    <div className='wrapper-searchbar'>
                        <label for='searchbar' className='searchbar-label'>Search game</label>
                        <input className='searchbar' type='text' />
                    </div>
                    <div className='wrapper-choicebar'>
                        {
                            rating.map(r => <CheckBoxGameChoice 
                                key={ `checkbox-game-${ r.score }` }
                                score={ r.score } /> )
                        }
                    </div>
                </div>
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
            </div>
        )
    }
}