import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import CheckBoxGameChoice from './CheckBoxGameChoice'
import SearchBar from '../../../shared/components/SearchBar'
import { swapRatingToIcon } from '../../../shared/helpers/helper';
import Game from './Game/Game';

class PageGames extends React.Component{
    render() {
        const { props } = this
        const rating = this.props.rating;
        const games = this.props.games ? _.orderBy(this.props.games, [game => game.title.toLowerCase()], ['desc']) : null

        return (
            <div className='flex-column'>
                <div className='wrapper-description'>
                    <div className='page-description'>
                        <p>Here's the list of games that 0.1% curates, as well as the percentage completion comparision between our members.</p>
                        <p>In the 0.1% community, we grade the ranks of our members by how many curated games they've completed, as well as the difficulty of those games. Each game specifies their own difficulty in the description.</p>
                        <p>The list also includes which three members completed the game first (with a gold, silver and bronze medals, respectively), as well as the member who has completed it the fastest based on Steam timestamps (with a trophy).</p>
                    </div>
                    { rating ?
                    <div className='wrapper-filter'>
                        <div className='wrapper-choicebar'>
                            {
                                rating.map(r => <CheckBoxGameChoice 
                                    key={ `checkbox-game-${ r.score }` }
                                    score={ r.score } 
                                    icon={ swapRatingToIcon(r.score, rating) }/> )
                            }
                        </div>
                        <SearchBar />
                    </div>
                    : null
                    }
                </div>
                <div className='wrapper-games'>
                    {
                        games
                            ? games.map(game =>
                                game.title.toLowerCase().indexOf(props.searchGame.toLowerCase()) !== -1
                                && props.showGamesRated.find(score => parseInt(score,10) === parseInt(game.rating,10))
                                ? <Game key={ `id-game-${game.id}` } game={ game } rating={ rating } />
                                : null)
                            : null
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ 
    searchGame: state.searchGame, 
    showGamesRated: state.showGamesRated,
    games: state.games,
    rating: state.rating
})

export default connect(
    mapStateToProps
)( PageGames ) 