import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

class SectionTrivia extends React.Component {
    constructor() {
        super()
        this.state = {
            games: {
                total: 0,
                all: []
            }
        }
        this.loadGames = this.loadGames.bind(this)
    }

    componentDidMount() {
        this.loadGames()
    }

    loadGames() {
        axios.get('/rest/api/games')
            .then(response => this.setState({ games: {
                total: response.data.length,
                all: response.data
            }}
        ))
    }

    render() {
        const members = this.props.members;
        const rating = this.props.rating;

        return(
        <div className='section'>
            <h3 className='section-title'>Trivia</h3>
            <p>Members total: <span className="bold">{ members.length }</span></p>
            <p>Curated games:</p>
            <ul>
                <li style={{ marginLeft: '30px' }} >total: <span className="bold">{ this.state.games.total }</span></li>
                <ul>
                    {
                        rating ? rating.map((tier, index) => 
                            <li style={{ marginLeft: '30px' }} key={ `${tier.score}-${index}` }><i className={ tier.icon } /><span className="bold">{ ` : ${ this.state.games.all.filter(game => game.rating === tier.id).length }` }</span></li>)
                            : null
                    }
                </ul>
            </ul>
        </div>)
    }
}

const mapStateToProps = state => ({ 
    members: state.members,
    rating: state.rating
})

export default connect(
  mapStateToProps
)( SectionTrivia )