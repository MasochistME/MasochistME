import React from 'react'
import { connect } from 'react-redux'
import ranking from '../../mock/ranking'
import rating from '../../config/rating'
import SearchBar from '../SearchBar'

class PageRanking extends React.Component{
    render() {
        const { props } = this;
        return (
            <div className="flex-column">
                <div className='wrapper-description'>
                    <div className='page-description'>
                    <p>Ranking system utilizes the games' score system. Depending on the game's individual difficulty level, it is given one of { rating.length } possible marks:</p>
				        <ul>
                            {
                                rating.map(r => <li><i className={ r.link } /> - worth { r.score } pts - { r.desc } </li>)
                            }
				        </ul>
                    <p>Completing a game might mean earning its most demanding achievement, or getting the in-game 100%; but for the sake of simplicity the ranking system present here assumes that completing a game means earning 100% of its Steam achievements. You are awarded points depending on the completed game's difficulty level, which are later summarized and used to determine your placement on the ranking ladder.</p>
                    </div>
                    <SearchBar />
                </div>
                <ul className="ranking-list">
                    {
                        ranking.map((member, index) => 
                            member.name.toLowerCase().indexOf(props.state.searchMember.toLowerCase()) !== -1
                            ? 
                                <li 
                                    className="member flex-row"
                                    key={ `member-${member.id}` }
                                >
                                    <div className="member-position">{ index+1 }</div>
                                    <img className="member-avatar" src={ member.avatar } alt="avatar"/>
                                    <div className="member-info flex-row">
                                        <div className="member-status"></div>
                                        <div className="member-name">{ member.name }</div>
                                        <div className="member-ranking flex-row">
                                            { 
                                                rating.map(score => 
                                                    <div className="member-rating-score">
                                                        <i className={ score.link } style={{ paddingRight: "5px"}}/> 
                                                        { member.ranking[score.score] !== undefined
                                                            ? member.ranking[score.score]
                                                            : "NaN" }
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </li>
                            : null
                        )
                    } 
                </ul>
            </div>
        )
    }
}

const mapStateToProps = state => ({ state })

export default connect(
    mapStateToProps
)( PageRanking ) 