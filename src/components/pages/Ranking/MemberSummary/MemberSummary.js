import React from 'react'

export default class MemberSummary extends React.Component {
    render() {
        const { member, index, rating } = this.props

        return(
            <div className="member-summary flex-row">
                <div className="member-position">{ index+1 }</div>
                <img className="member-avatar" src={ member.avatar } alt="avatar"/>
                <div className="member-info flex-row">
                    <div className="member-status"></div>
                    <div className="member-name">{ member.name }</div>
                    <div className="member-ranking flex-row">
                        <div className="member-rating-score">
                            { member.points }
                            <span className="bold"> Σ</span>
                        </div>
                        {   
                            rating.map((score, scoreIndex) => {
                                return <div className="member-rating-score" key={`member-rating-score-${scoreIndex}`}>
                                    { member.ranking[score.score] !== undefined
                                        ? member.ranking[score.score]
                                        : "NaN" }
                                    <i className={ score.link } style={{ paddingRight: "5px"}}/> 
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}