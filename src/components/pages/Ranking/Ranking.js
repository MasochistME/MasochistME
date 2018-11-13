import React from 'react'
import axios from 'axios'
import _ from 'lodash'
import { connect } from 'react-redux'
import SearchBar from '../../../shared/components/SearchBar'
import Member from './Member';

class PageRanking extends React.Component {
    constructor() {
        super()
        this.state = { 
            rating: [ ],
            members: [ ]
        };
        this.load = this.load.bind(this)
    }

    componentDidMount() {
        this.load()
    }

    async load() {
        await this.loadRating()
        await this.loadMembers()
    }

    loadRating = () => {
        axios.get('http://localhost:3001/data/rating')
            .then(response => {
                if (response.status === 200)
                    return this.setState({ rating: response.data })
            }).catch(err => console.trace(err))
    }

    loadMembers = () => {
        axios.get('http://localhost:3001/api/members')
            .then(response => {
                if (response.status === 200) {
                    let members = response.data;
                    members.map(member => {
                        let summary = 0
                        this.state.rating.map(r => summary += r.score * member.ranking[r.score])
                        member.points = summary
                        return member   
                    })
                    members = _.orderBy(members, ['points'], ['desc'])
                    return this.setState({ members: members })
                }
            }).catch(err => console.trace(err))
    }

    render() {
        const { props } = this;
        const rating = this.state.rating;
        const ranking = this.state.members; //change names here

        const createRankingList = () => {
            if (ranking.length <= 0)
                return;
            return ranking.map((member, index) => 
                member.name.toLowerCase().indexOf(props.searchMember.toLowerCase()) !== -1
                    ? <Member member={ member } index={ index } rating={ this.state.rating } />
                    : null
                )
            }

        return (
            <div className="flex-column">
                <div className='wrapper-description'>
                    <div className='page-description'>
                    <p>Ranking system utilizes the games' score system. Depending on the game's individual difficulty level, it is given one of { rating.length } possible marks:</p>
				        <ul>
                            { rating.map(r => <li><i className={ r.link } /> - worth { r.score } pts - { r.desc } </li>) }
				        </ul>
                    <p>Completing a game might mean earning its most demanding achievement, or getting the in-game 100%; but for the sake of simplicity the ranking system present here assumes that completing a game means earning 100% of its Steam achievements. You are awarded points depending on the completed game's difficulty level, which are later summarized and used to determine your placement on the ranking ladder.</p>
                    </div>
                    <SearchBar />
                </div>
                <ul className="ranking-list">
                    { createRankingList() }
                </ul>
            </div>
        )
    }
}

const mapStateToProps = state => ({ 
    searchMember: state.searchMember 
})

export default connect(
    mapStateToProps
)( PageRanking ) 