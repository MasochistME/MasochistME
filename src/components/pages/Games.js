import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import _ from 'lodash'
import CheckBoxGameChoice from '../CheckBoxGameChoice'
import SearchBar from '../SearchBar'
import rating from '../../config/rating'
// import games from '../../mock/games.json' //THIS IS FOR DEV PURPOSES - GONNA BE CHANGED TO JSON DOWNLOADED FRMO THE SERVER
import { swapRatingToIcon } from '../../helpers/helper';

class PageGames extends React.Component{
    constructor() {
        super()
        this.state = {
            games: [ ]
        }
        this.updateTimeout = null;
        this.loadGames = this.loadGames.bind(this)
    }

    componentDidMount() {
        this.loadGames()
    }
    componentWillUnmount() {
        clearInterval(this.updateTimeout)
    }

    loadGames() {
        axios.get('http://localhost:3001/api/games')
            .then(response => {
                if (response.status === 200)
                    return this.setState({ games: _.orderBy(response.data, ['title', 'score'], ['asc', 'desc']) })
            })
            .catch(err => console.log(err.message))
    }

    render() {
        const { props } = this
        return (
            <div className='flex-column'>
                <div className='wrapper-description'>
                    <div className='page-description'>
                        <p>Here's the list of games that 0.1% curates, as well as the percentage completion comparision between our members.</p>
                        <p>In the 0.1% community, we grade the ranks of our members by how many curated games they've completed, as well as the difficulty of those games (rated with 1, 2, 3 or 5 points). Each game specifies on their description their own difficulty.</p>
                        <p>The list also includes which three members completed the game first (with a gold, silver and bronze medals, respectively), as well as the member who has completed it the fastest based on Steam timestamps (with a trophy).</p>
                    </div>
                    <SearchBar />
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
                        this.state.games.map(game =>
                            game.title.toLowerCase().indexOf(props.state.searchGame.toLowerCase()) !== -1
                            && props.state.showGamesRated.find(score => parseInt(score,10) === parseInt(game.rating,10))
                            ? <div 
                                key={ `id-game-${game.id}` }
                                className={ `game rated-${game.rating}` }
                                style={{ backgroundImage:`url(${game.img})`}}
                                >                     
                                <div className='game-info'>
                                    <div className='game-rating'>
                                        <i className={ swapRatingToIcon(game.rating) }></i>
                                    </div>
                                    <div className='game-title'>{ game.title }</div>
                                    <div className='game-desc'>{ game.desc }</div>
                                </div>
                            </div>
                            : null
                        )
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ state })

export default connect(
    mapStateToProps
)( PageGames ) 