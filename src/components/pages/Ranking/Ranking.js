import React from 'react'
import { connect } from 'react-redux'
import SearchBar from '../../../shared/components/SearchBar'
import Member from './Member';

class PageRanking extends React.Component {
    render() {
        const { props } = this;
        const rating = this.props.rating;
        const ranking = this.props.members; //change names here
        const patrons = this.props.patrons;

        const createRankingList = () => {
            if (ranking.length <= 0)
                return;
            return ranking.map((member, memberIndex) => 
                member.name.toLowerCase().indexOf(props.searchMember.toLowerCase()) !== -1
                    ? <Member 
                        member={ member } 
                        index={ memberIndex } 
                        rating={ this.props.rating } 
                        games={ this.props.games } 
                        patron={ patrons.find(tier => tier.list.find(p => p.steamid === member.id) ? { tier: tier.tier, description: tier.description } : false) } 
                        key={ `member-${member.id}` }/>
                    : null
                )
            }

        return (
            <div className="flex-column">
                <div className='wrapper-description'>
                    <div className='page-description'>
                    <p>Ranking system utilizes the games' score system. Depending on the game's individual difficulty level, it is given one of { rating.length } possible marks:</p>
				        <ul>
                            { rating.map((r, rIndex) => <li key={ `r-${rIndex}` }><i className={ r.icon } /> - worth { r.score } pts - { r.description } </li>) }
				        </ul>
                    <p>Completing a game might mean earning its most demanding achievement, or getting the in-game 100%; but for the sake of simplicity the ranking system present here assumes that completing a game means earning 100% of its Steam achievements. You are awarded points depending on the completed game's difficulty level, which are later summarized and used to determine your placement on the ranking ladder.</p>
                    </div>
                    <SearchBar />
                </div>
                <ul className="ranking-list">
                    { createRankingList() || <div>Skeleton</div>}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = state => ({ 
    searchMember: state.searchMember,
    members: state.members,
    rating: state.rating,
    games: state.games,
    patrons: state.patrons
})

export default connect(
    mapStateToProps
)( PageRanking ) 