import React from 'react'
import ranking from '../../mock/ranking'
import rating from '../../config/rating'

export default class PageRanking extends React.Component{
    render() {
        return (
            <ul className="ranking-list">
                {
                    ranking.map((member, index) => 
                        <li 
                            className="member flex-row"
                            key={ `member-${member.id}` }
                        >
                            <div className="member-position">{ index+1 }</div>
                            <img class="member-avatar" src={ member.avatar } alt="avatar"/>
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
                    )
                } 
            </ul>
        )
    }
}