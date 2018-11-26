import React from 'react'
import axios from 'axios'

export default class SectionTrivia extends React.Component {
    constructor() {
        super()
        this.state = {
            members: 0,
            games: {
                total: 0
            }
        }
        this.loadGames = this.loadGames.bind(this)
        this.loadMembers = this.loadMembers.bind(this)
    }

    componentDidMount() {
        this.loadMembers()
        this.loadGames()
    }

    loadGames() {
        axios.get('http://localhost:3001/api/games')
            .then(response => this.setState({ games: {
                total: response.data.length
            }}
        ))
    }

    loadRating() {
        axios.get('http://localhost:3001/data/rating')
            .then(response => this.setState({ rating: response.data }))
    }

    loadMembers() {
        axios.get('http://localhost:3001/api/members')
            .then(response => this.setState({ members: response.data.length }))
    }

    render() {
        return(
        <div className='section'>
            <h3 className='section-title'>Trivia</h3>
            <p>Members total: <span className="bold">{ this.state.members }</span></p>
            <p>Curated games:</p>
            <ul>
                <li>total: <span className="bold">{ this.state.games.total }</span></li>
            </ul>
        </div>)
    }
}